import { redirect } from "react-router";
import {
  AuthSessionExpiredError,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import {
  destroySession,
  getSession,
  getUser as getSessionUser,
} from "~/lib/server/session.server";
import {
  destinationFromOnboardingState,
  getOnboardingState,
  type OnboardingState,
} from "~/services/onboarding.server";
import type { AuthenticatedUser, Profile } from "./types";

type GuardResult = {
  user: AuthenticatedUser;
  state: OnboardingState;
  setCookie?: string;
};

export type OptionalUserResult = {
  user: AuthenticatedUser | null;
  setCookie?: string;
};

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

function isOnboardingRequiredError(error: unknown) {
  return (
    error instanceof ProtectedApiError &&
    error.status === 403 &&
    error.code === "ONBOARDING_REQUIRED"
  );
}

function isUserNotFoundError(error: unknown) {
  if (!(error instanceof ProtectedApiError)) return false;
  if (error.status === 404) return true;
  if (error.code === "USER_NOT_FOUND") return true;
  return error.message.toLowerCase().includes("user not found");
}

function getUserIdentity(user: unknown) {
  if (!user || typeof user !== "object") {
    return { id: "", email: "" };
  }

  const candidate = user as Record<string, unknown>;
  return {
    id: typeof candidate.id === "string" ? candidate.id : "",
    email: typeof candidate.email === "string" ? candidate.email : "",
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

function readString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function readBoolean(value: unknown) {
  return typeof value === "boolean" ? value : false;
}

function buildUserProfile(
  user: unknown,
  state: OnboardingState,
  displayName: string,
): Profile {
  const userRecord = isObject(user) ? user : {};
  const rawProfile: Record<string, unknown> = isObject(state.raw.profile)
    ? state.raw.profile
    : {};
  const existingProfile: Record<string, unknown> = isObject(userRecord.profile)
    ? userRecord.profile
    : {};

  return {
    id: readString(existingProfile.id),
    displayName: readString(existingProfile.displayName) || displayName,
    avatarKey:
      readString(rawProfile.avatarKey) || readString(existingProfile.avatarKey),
    avatarUrl:
      readString(rawProfile.avatarUrl) ||
      readString(existingProfile.avatarUrl) ||
      readString(userRecord.avatar),
  };
}

function mergeUserWithOnboardingState(
  user: unknown,
  state: OnboardingState,
): AuthenticatedUser {
  const userRecord = isObject(user) ? user : {};
  const email = readString(userRecord.email) || state.raw.user.email;
  const name = readString(userRecord.name) || email.split("@")[0] || "User";

  return {
    id: readString(userRecord.id) || state.raw.user.id,
    email,
    emailVerified: readBoolean(userRecord.emailVerified),
    name,
    profile: buildUserProfile(userRecord, state, name),
  };
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
  const user = await getSessionUser(request);
  if (!user) return { user: null };

  try {
    const { state, setCookie } = await getOnboardingState(request);
    if (!state.completed) {
      throw redirect(
        destinationFromOnboardingState(state),
        setCookie ? { headers: { "Set-Cookie": setCookie } } : {},
      );
    }

    return {
      user: mergeUserWithOnboardingState(user, state),
      setCookie,
    };
  } catch (error) {
    if (error instanceof AuthSessionExpiredError) {
      throw await clearAndRedirectToLogin(request);
    }
    if (isUserNotFoundError(error)) {
      throw await clearAndRedirectToLogin(request);
    }
    if (isOnboardingRequiredError(error)) {
      throw redirect("/onboarding");
    }
    throw error;
  }
}

export async function redirectIfAuthenticated(request: Request) {
  const user = await getSessionUser(request);
  if (!user) return null;

  try {
    const { state, setCookie } = await getOnboardingState(request);
    const to = destinationFromOnboardingState(state);
    return redirect(
      to,
      setCookie ? { headers: { "Set-Cookie": setCookie } } : {},
    );
  } catch (error) {
    if (error instanceof AuthSessionExpiredError) {
      return clearAndRedirectToLogin(request);
    }
    if (isUserNotFoundError(error)) {
      return clearAndRedirectToLogin(request);
    }
    if (isOnboardingRequiredError(error)) {
      return redirect("/onboarding");
    }
    throw error;
  }
}

export async function requireOnboardingIncomplete(request: Request) {
  const user = await requireAuthenticatedUser(request);

  try {
    const { state, setCookie } = await getOnboardingState(request);
    if (state.completed) {
      throw redirect(
        "/dashboard",
        setCookie ? { headers: { "Set-Cookie": setCookie } } : {},
      );
    }
    return {
      user: mergeUserWithOnboardingState(user, state),
      state,
      setCookie,
    } satisfies GuardResult;
  } catch (error) {
    if (error instanceof AuthSessionExpiredError) {
      throw await clearAndRedirectToLogin(request);
    }
    if (isUserNotFoundError(error)) {
      throw await clearAndRedirectToLogin(request);
    }
    if (isOnboardingRequiredError(error)) {
      const identity = getUserIdentity(user);
      const fallbackState: OnboardingState = {
        completed: false,
        currentStep: 1,
        raw: {
          user: {
            id: identity.id,
            email: identity.email,
            role: "member",
            onboardingStep: 1,
            onboardingCompletedAt: null,
          },
          profile: null,
          selectedInterestIds: [],
          selectedContributionKeys: [],
          progress: {
            totalPoints: 0,
            tier: null,
          },
        },
      };
      return {
        user,
        state: fallbackState,
        setCookie: undefined,
      };
    }
    throw error;
  }
}

export async function requireUser(request: Request): Promise<GuardResult> {
  const user = await requireAuthenticatedUser(request);

  try {
    const { state, setCookie } = await getOnboardingState(request);
    if (!state.completed) {
      throw redirect(
        destinationFromOnboardingState(state),
        setCookie ? { headers: { "Set-Cookie": setCookie } } : {},
      );
    }
    return {
      user: mergeUserWithOnboardingState(user, state),
      state,
      setCookie,
    };
  } catch (error) {
    if (error instanceof AuthSessionExpiredError) {
      throw await clearAndRedirectToLogin(request);
    }
    if (isUserNotFoundError(error)) {
      throw await clearAndRedirectToLogin(request);
    }
    if (isOnboardingRequiredError(error)) {
      throw redirect("/onboarding");
    }
    throw error;
  }
}

export async function requireCompletedPageAccess(request: Request) {
  const user = await requireAuthenticatedUser(request);

  try {
    // Use a fresh onboarding state here to ensure that users who have just
    // completed onboarding are checked against the most up-to-date data
    // before accessing completion-only pages.
    const { state, setCookie } = await getOnboardingState(request, {
      forceFresh: true,
    });
    if (!state.completed) {
      throw redirect(
        destinationFromOnboardingState(state),
        setCookie ? { headers: { "Set-Cookie": setCookie } } : {},
      );
    }
    return {
      user: mergeUserWithOnboardingState(user, state),
      state,
      setCookie,
    };
  } catch (error) {
    if (error instanceof AuthSessionExpiredError) {
      throw await clearAndRedirectToLogin(request);
    }
    if (isUserNotFoundError(error)) {
      throw await clearAndRedirectToLogin(request);
    }
    throw error;
  }
}
