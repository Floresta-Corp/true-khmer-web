import { redirect } from "react-router";
import { routeForAccessState } from "~/lib/server/auth/access-control.server";
import {
  AuthSessionExpiredError,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import {
  authenticatedUserFromOnboardingState,
  authenticatedUserFromSessionUser,
} from "~/lib/server/auth/authenticated-user.server";
import {
  destroySession,
  getSession,
  getUser as getSessionUser,
} from "~/lib/server/session.server";
import { getAuthSession } from "~/services/auth/session.server";
import {
  getOnboardingState,
  type OnboardingState,
} from "~/services/onboarding.server";
import type { AuthenticatedUser } from "./types";

type GuardResult = {
  user: AuthenticatedUser;
  setCookie?: string;
};

type OnboardingGuardResult = GuardResult & {
  state: OnboardingState;
};

type GuardOptions = {
  forceFresh?: boolean;
};

export type OptionalUserResult = {
  user: AuthenticatedUser | null;
  setCookie?: string;
};

function redirectWithCookie(to: string, setCookie?: string) {
  return redirect(to, setCookie ? { headers: { "Set-Cookie": setCookie } } : {});
}

function requestWithSetCookie(request: Request, setCookie?: string) {
  if (!setCookie) return request;

  const cookiePair = setCookie.split(";", 1)[0];
  const separatorIndex = cookiePair.indexOf("=");
  if (separatorIndex <= 0) return request;

  const cookieName = cookiePair.slice(0, separatorIndex);
  const existingCookie = request.headers.get("Cookie") ?? "";
  const nextCookies = existingCookie
    .split(";")
    .map((cookie) => cookie.trim())
    .filter((cookie) => cookie && !cookie.startsWith(`${cookieName}=`));

  nextCookies.push(cookiePair);

  const headers = new Headers(request.headers);
  headers.set("Cookie", nextCookies.join("; "));

  return new Request(request, { headers });
}

function loginRedirectPath(request: Request) {
  const url = new URL(request.url);
  const redirectTo = `${url.pathname}${url.search}`;
  const params = new URLSearchParams({ redirectTo });
  return `/login?${params.toString()}`;
}

async function clearAndRedirectToLogin(request: Request, redirectTo?: string) {
  const session = await getSession(request);
  const params = redirectTo
    ? `?redirectTo=${encodeURIComponent(redirectTo)}`
    : "";

  return redirect(`/login${params}`, {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

function isProtectedApiCode(error: unknown, code: string) {
  return (
    error instanceof ProtectedApiError &&
    error.status === 403 &&
    error.code === code
  );
}

function isUserNotFoundError(error: unknown) {
  if (!(error instanceof ProtectedApiError)) return false;
  if (error.status === 404) return true;
  if (error.code === "USER_NOT_FOUND") return true;
  return error.message.toLowerCase().includes("user not found");
}

async function redirectForGuardError(error: unknown, request: Request) {
  if (error instanceof AuthSessionExpiredError || isUserNotFoundError(error)) {
    return clearAndRedirectToLogin(request);
  }
  if (isProtectedApiCode(error, "SIGNUP_COMPLETION_REQUIRED")) {
    return redirect("/complete-signup");
  }
  if (isProtectedApiCode(error, "ONBOARDING_REQUIRED")) {
    return redirect("/onboarding/profile");
  }

  return null;
}

// Use for auth-flow pages/actions that only need a logged-in session.
// This does not check whether signup or onboarding is complete.
export async function requireAuthUser(
  request: Request,
): Promise<AuthenticatedUser> {
  const user = await getSessionUser(request);
  if (!user) {
    throw redirect(loginRedirectPath(request));
  }

  return user as AuthenticatedUser;
}

// Use for public app routes. Anonymous users are allowed, but logged-in users
// must be ACTIVE or they are redirected to their required signup/onboarding step.
export async function getOptionalUser(
  request: Request,
): Promise<OptionalUserResult> {
  const localUser = await getSessionUser(request);
  if (!localUser) return { user: null };

  try {
    const { session, setCookie } = await getAuthSession(request);
    if (session.authFlow.accessState !== "ACTIVE") {
      throw redirectWithCookie(
        routeForAccessState(session.authFlow.accessState),
        setCookie,
      );
    }

    return {
      user: authenticatedUserFromSessionUser(session.user),
      setCookie,
    };
  } catch (error) {
    const redirectResponse = await redirectForGuardError(error, request);
    if (redirectResponse) throw redirectResponse;
    throw error;
  }
}

export async function redirectIfAuthenticated(request: Request) {
  const localUser = await getSessionUser(request);
  if (!localUser) return null;

  try {
    const { session, setCookie } = await getAuthSession(request);
    return redirectWithCookie(
      routeForAccessState(session.authFlow.accessState),
      setCookie,
    );
  } catch (error) {
    const redirectResponse = await redirectForGuardError(error, request);
    if (redirectResponse) return redirectResponse;
    throw error;
  }
}

// Use for /complete-signup only. The user must be logged in and currently
// required to complete signup.
export async function requireSignupCompletion(
  request: Request,
): Promise<GuardResult> {
  await requireAuthUser(request);

  try {
    const { session, setCookie } = await getAuthSession(request);
    if (session.authFlow.accessState !== "SIGNUP_REQUIRED") {
      throw redirectWithCookie(
        routeForAccessState(session.authFlow.accessState),
        setCookie,
      );
    }

    return {
      user: authenticatedUserFromSessionUser(session.user),
      setCookie,
    };
  } catch (error) {
    const redirectResponse = await redirectForGuardError(error, request);
    if (redirectResponse) throw redirectResponse;
    throw error;
  }
}

// Use for /onboarding only. The user must be logged in and currently required
// to complete onboarding.
export async function requireOnboarding(
  request: Request,
): Promise<OnboardingGuardResult> {
  const localUser = await requireAuthUser(request);

  try {
    const authSessionResult = await getAuthSession(request);
    const { accessState } = authSessionResult.session.authFlow;

    if (accessState !== "ONBOARDING_REQUIRED") {
      throw redirectWithCookie(
        routeForAccessState(accessState),
        authSessionResult.setCookie,
      );
    }

    const onboardingRequest = requestWithSetCookie(
      request,
      authSessionResult.setCookie,
    );
    const onboardingResult = await getOnboardingState(onboardingRequest);
    const { state } = onboardingResult;
    const setCookie = onboardingResult.setCookie ?? authSessionResult.setCookie;
    if (state.completed) {
      throw redirectWithCookie("/home", setCookie);
    }

    return {
      user: authenticatedUserFromOnboardingState(localUser, state),
      state,
      setCookie,
    };
  } catch (error) {
    const redirectResponse = await redirectForGuardError(error, request);
    if (redirectResponse) throw redirectResponse;
    throw error;
  }
}

// Use for normal protected app routes/actions. The user must be logged in and
// backend /auth/session must say the account is ACTIVE.
export async function requireUser(
  request: Request,
  options: GuardOptions = {},
): Promise<GuardResult> {
  await requireAuthUser(request);

  try {
    const { session, setCookie } = await getAuthSession(request, {
      forceFresh: options.forceFresh,
    });
    if (session.authFlow.accessState !== "ACTIVE") {
      throw redirectWithCookie(
        routeForAccessState(session.authFlow.accessState),
        setCookie,
      );
    }

    return {
      user: authenticatedUserFromSessionUser(session.user),
      setCookie,
    };
  } catch (error) {
    const redirectResponse = await redirectForGuardError(error, request);
    if (redirectResponse) throw redirectResponse;
    throw error;
  }
}
