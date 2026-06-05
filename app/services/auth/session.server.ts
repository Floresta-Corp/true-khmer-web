import { apiRequestWithSession } from "~/lib/server/api-client.server";
import {
  isAccessState,
  isAuthNextStep,
  isRequiredAction,
  normalizeAuthFlow,
  type AuthFlow,
  type NormalizedAuthFlow,
} from "~/lib/server/auth/access-control.server";
import { getUser } from "~/lib/server/session.server";
import type { AuthenticatedBackendUser } from "~/services/auth/api.server";

export type AuthSession = {
  user: AuthenticatedBackendUser;
  authFlow: NormalizedAuthFlow;
};

type AuthSessionCacheEntry = {
  session: AuthSession;
  expiresAt: number;
};

type GetAuthSessionOptions = {
  forceFresh?: boolean;
};

const AUTH_SESSION_CACHE_TTL_MS = 60 * 1000;
const AUTH_SESSION_CACHE_MAX_ENTRIES = 2000;
const authSessionCache = new Map<string, AuthSessionCacheEntry>();

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

function parseAuthSessionResponse(payload: unknown): AuthSession {
  if (!isObject(payload)) {
    throw new Error("Invalid /auth/session response: response must be an object");
  }

  if (!isObject(payload.user)) {
    throw new Error("Invalid /auth/session response: missing user");
  }

  if (!isObject(payload.authFlow)) {
    throw new Error("Invalid /auth/session response: missing authFlow");
  }

  const user = payload.user;
  const authFlow = payload.authFlow;

  if (typeof user.id !== "string" || typeof user.email !== "string") {
    throw new Error("Invalid /auth/session response: invalid user");
  }

  if (
    typeof authFlow.isNewUser !== "boolean" ||
    typeof authFlow.requiresSignupCompletion !== "boolean" ||
    typeof authFlow.requiresOnboarding !== "boolean" ||
    !isAuthNextStep(authFlow.nextStep)
  ) {
    throw new Error("Invalid /auth/session response: invalid authFlow");
  }

  const baseAuthFlow: AuthFlow = {
    isNewUser: authFlow.isNewUser,
    requiresSignupCompletion: authFlow.requiresSignupCompletion,
    requiresOnboarding: authFlow.requiresOnboarding,
    nextStep: authFlow.nextStep,
    ...(isAccessState(authFlow.accessState)
      ? { accessState: authFlow.accessState }
      : {}),
    ...(isRequiredAction(authFlow.requiredAction)
      ? { requiredAction: authFlow.requiredAction }
      : {}),
  };

  return {
    user: user as AuthenticatedBackendUser,
    authFlow: normalizeAuthFlow(baseAuthFlow),
  };
}

function trimCacheToMaxEntries() {
  while (authSessionCache.size > AUTH_SESSION_CACHE_MAX_ENTRIES) {
    const oldest = authSessionCache.keys().next();
    if (oldest.done) break;
    authSessionCache.delete(oldest.value);
  }
}

async function userCacheKey(request: Request) {
  const user = await getUser(request);
  return user?.id ? String(user.id) : "anonymous";
}

function getCachedAuthSession(key: string) {
  const cached = authSessionCache.get(key);
  if (!cached) return null;

  if (cached.expiresAt <= Date.now()) {
    authSessionCache.delete(key);
    return null;
  }

  authSessionCache.delete(key);
  authSessionCache.set(key, cached);
  return cached.session;
}

function setCachedAuthSession(key: string, session: AuthSession) {
  authSessionCache.set(key, {
    session,
    expiresAt: Date.now() + AUTH_SESSION_CACHE_TTL_MS,
  });
  trimCacheToMaxEntries();
}

export async function invalidateAuthSessionCacheForRequest(request: Request) {
  authSessionCache.delete(await userCacheKey(request));
}

export async function getAuthSession(
  request: Request,
  options: GetAuthSessionOptions = {},
) {
  const key = await userCacheKey(request);

  if (!options.forceFresh) {
    const cached = getCachedAuthSession(key);
    if (cached) return { session: cached };
  }

  const result = await apiRequestWithSession<unknown>(request, "/auth/session");
  const session = parseAuthSessionResponse(result.data);
  setCachedAuthSession(key, session);

  return {
    session,
    setCookie: result.setCookie,
  };
}
