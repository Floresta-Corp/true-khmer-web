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

export type OptionalUserResult = {
  user: AuthenticatedUser | null;
  setCookie?: string;
};

function redirectWithCookie(to: string, setCookie?: string) {
  return redirect(to, setCookie ? { headers: { "Set-Cookie": setCookie } } : {});
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

export async function requireAuthenticatedUser(
  request: Request,
): Promise<AuthenticatedUser> {
  const user = await getSessionUser(request);
  if (!user) {
    throw redirect(loginRedirectPath(request));
  }

  return user as AuthenticatedUser;
}

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

export async function requireOnboardingIncomplete(
  request: Request,
): Promise<OnboardingGuardResult> {
  const localUser = await requireAuthenticatedUser(request);

  try {
    const authSessionResult = await getAuthSession(request);
    const { accessState } = authSessionResult.session.authFlow;

    if (accessState !== "ONBOARDING_REQUIRED") {
      throw redirectWithCookie(
        routeForAccessState(accessState),
        authSessionResult.setCookie,
      );
    }

    const { state, setCookie } = await getOnboardingState(request);
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

export async function requireUser(request: Request): Promise<GuardResult> {
  await requireAuthenticatedUser(request);

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

export async function requireCompletedPageAccess(
  request: Request,
): Promise<GuardResult> {
  await requireAuthenticatedUser(request);

  try {
    const { session, setCookie } = await getAuthSession(request, {
      forceFresh: true,
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
