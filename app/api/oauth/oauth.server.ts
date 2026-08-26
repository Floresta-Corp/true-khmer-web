import {
  apiRequestPublic,
  apiRequestWithAccessToken,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import {
  commitSession,
  getSession,
  isAutoRefreshEnabled,
} from "~/lib/server/session.server";
import { refreshAccessToken } from "~/services/auth/api.server";
import type {
  ProfileResponse,
  SsoVerifyClientResponse,
} from "~/types/api-client";

type OAuthMeUser = ProfileResponse["profile"]["user"];

export type OAuthSessionResolution = {
  user: OAuthMeUser | null;
  accessToken: string | null;
  setCookie?: string;
};

const UNAUTHORIZED = Symbol("unauthorized");

// /sso/users/{id} is a server-to-server endpoint gated by client credentials
// (x-client-id + x-client-secret), which the popup does not hold — it resolves
// the signed-in account from the site session's own access token instead.
async function fetchMe(request: Request, accessToken: string) {
  try {
    const data = await apiRequestWithAccessToken<ProfileResponse>(
      request,
      accessToken,
      "/me",
      { method: "GET" },
    );

    const user = data?.profile?.user;
    if (!data?.ok || !user?.id || !user.email) return null;

    return user;
  } catch (error) {
    if (
      error instanceof ProtectedApiError &&
      (error.status === 401 || error.status === 403)
    ) {
      return UNAUTHORIZED;
    }
    throw error;
  }
}

// Resolves the account behind the browser's normal site session, refreshing the
// access token when it has expired so the token handed to /sso/handoff is one
// the API still accepts.
export async function getOAuthSessionUser(
  request: Request,
): Promise<OAuthSessionResolution> {
  const session = await getSession(request);
  const accessToken = session.get("accessToken") as string | undefined;
  const refreshToken = session.get("refreshToken") as string | undefined;

  if (!accessToken) return { user: null, accessToken: null };

  const result = await fetchMe(request, accessToken);
  if (result !== UNAUTHORIZED) {
    return { user: result, accessToken: result ? accessToken : null };
  }

  if (!refreshToken || !isAutoRefreshEnabled(session)) {
    return { user: null, accessToken: null };
  }

  let refreshedToken: string;
  let setCookie: string;
  try {
    const refreshed = await refreshAccessToken(refreshToken, request);
    refreshedToken = refreshed.accessToken;
    session.set("accessToken", refreshed.accessToken);
    session.set("refreshToken", refreshed.refreshToken);
    setCookie = await commitSession(session);
  } catch {
    // A dead refresh token just means the popup has to ask for a login.
    return { user: null, accessToken: null };
  }

  const retried = await fetchMe(request, refreshedToken);
  if (retried === UNAUTHORIZED || !retried) {
    return { user: null, accessToken: null, setCookie };
  }

  return { user: retried, accessToken: refreshedToken, setCookie };
}

// The public client lookup doubles as the origin check: the API only answers
// when `origin` is one the client registered, so a 404 means this page has no
// business posting a handoff token back to whoever opened it.
export async function verifyOAuthClient(
  request: Request,
  clientId: string,
  origin: string,
): Promise<SsoVerifyClientResponse["client"] | null> {
  try {
    const { data } = await apiRequestPublic<SsoVerifyClientResponse>(
      request,
      `/sso/clients/${encodeURIComponent(clientId)}?origin=${encodeURIComponent(origin)}`,
      { method: "GET" },
    );

    if (!data?.ok || !data.client?.clientId) return null;

    return data.client;
  } catch (error) {
    if (
      error instanceof ProtectedApiError &&
      (error.status === 400 || error.status === 404)
    ) {
      return null;
    }
    throw error;
  }
}

async function verifyNativeOAuthClient(
  request: Request,
  clientId: string,
  platform: "ios" | "android",
  query: URLSearchParams,
): Promise<SsoVerifyClientResponse["client"] | null> {
  try {
    const { data } = await apiRequestPublic<SsoVerifyClientResponse>(
      request,
      `/sso/clients/${encodeURIComponent(clientId)}/${platform}?${query.toString()}`,
      { method: "GET" },
    );

    if (!data?.ok || !data.client?.clientId || !data.client.redirectUri) {
      return null;
    }

    return data.client;
  } catch (error) {
    if (
      error instanceof ProtectedApiError &&
      (error.status === 400 || error.status === 404)
    ) {
      return null;
    }
    throw error;
  }
}

export function verifyIosOAuthClient(
  request: Request,
  clientId: string,
  bundleIdentifier: string,
  urlScheme: string,
) {
  return verifyNativeOAuthClient(
    request,
    clientId,
    "ios",
    new URLSearchParams({ bundleIdentifier, urlScheme }),
  );
}

export function verifyAndroidOAuthClient(
  request: Request,
  clientId: string,
  packageName: string,
  sha1CertificateFingerprint: string,
) {
  return verifyNativeOAuthClient(
    request,
    clientId,
    "android",
    new URLSearchParams({ packageName, sha1CertificateFingerprint }),
  );
}
