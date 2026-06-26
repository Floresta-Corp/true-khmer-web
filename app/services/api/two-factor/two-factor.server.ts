import {
  AuthSessionExpiredError,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import { resolveApiBase } from "~/lib/server/api-base.server";
import {
  commitSession,
  destroySession,
  getSession,
  isAutoRefreshEnabled,
} from "~/lib/server/session.server";
import { refreshAccessToken } from "~/services/auth/api.server";
import type {
  AuthLoginTwoFactorEmailVerifyRequest,
  AuthLoginTwoFactorSessionRequest,
  AuthLoginTwoFactorTotpVerifyRequest,
  AuthStatusResponse,
  AuthTokenResponse,
  AuthTwoFactorEmailVerifyRequest,
  AuthTwoFactorSettingsResponse,
  AuthTwoFactorTotpSetupRequest,
  AuthTwoFactorTotpSetupResponse,
  AuthTwoFactorTotpVerifyRequest,
} from "~/types/api-client";
import { redirect } from "react-router";

type TwoFactorApiResult<T> = {
  data: T;
  setCookie?: string | string[];
};

function getResponseSetCookies(headers: Headers) {
  const headersWithSetCookie = headers as Headers & {
    getSetCookie?: () => string[];
  };
  const setCookies = headersWithSetCookie.getSetCookie?.();
  if (setCookies?.length) return setCookies;

  const setCookie = headers.get("set-cookie");
  return setCookie ? [setCookie] : [];
}

function appendRequestCookies(headers: Headers, request: Request) {
  const cookie = request.headers.get("Cookie");
  if (cookie) headers.set("Cookie", cookie);
}

async function parseResponsePayload(response: Response) {
  return (await response.json().catch(() => ({}))) as {
    code?: string;
    error?: string;
    message?: string;
  };
}

function throwTwoFactorError(
  response: Response,
  payload: Awaited<ReturnType<typeof parseResponsePayload>>,
) {
  throw new ProtectedApiError(
    payload.message || payload.error || "Two-factor request failed.",
    response.status,
    payload.code,
    payload,
    response.headers,
  );
}

async function fetchProtectedTwoFactor<K extends object>(
  request: Request,
  path: string,
  accessToken: string,
  body?: K,
) {
  const headers = new Headers({
    Authorization: `Bearer ${accessToken}`,
    ...(body ? { "Content-Type": "application/json" } : {}),
  });
  appendRequestCookies(headers, request);

  return fetch(`${resolveApiBase(request)}${path}`, {
    method: body ? "POST" : "GET",
    credentials: "include",
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

async function protectedTwoFactorRequest<T, K extends object>(
  request: Request,
  path: string,
  body?: K,
): Promise<TwoFactorApiResult<T>> {
  const session = await getSession(request);
  let accessToken = session.get("accessToken") as string | undefined;
  const refreshToken = session.get("refreshToken") as string | undefined;

  if (!accessToken) {
    throw new AuthSessionExpiredError();
  }

  let response = await fetchProtectedTwoFactor(
    request,
    path,
    accessToken,
    body,
  );
  const setCookies = getResponseSetCookies(response.headers);

  if (
    response.status === 401 &&
    refreshToken &&
    isAutoRefreshEnabled(session)
  ) {
    try {
      const refreshed = await refreshAccessToken(refreshToken, request);
      accessToken = refreshed.accessToken;
      session.set("accessToken", refreshed.accessToken);
      session.set("refreshToken", refreshed.refreshToken);
      setCookies.push(await commitSession(session));
    } catch {
      throw redirect("/login", {
        headers: { "Set-Cookie": await destroySession(session) },
      });
    }

    response = await fetchProtectedTwoFactor(request, path, accessToken, body);
    setCookies.push(...getResponseSetCookies(response.headers));
  }

  const payload = await parseResponsePayload(response);
  if (!response.ok) {
    throwTwoFactorError(response, payload);
  }

  return {
    data: payload as T,
    setCookie: setCookies.length
      ? setCookies.length === 1
        ? setCookies[0]
        : setCookies
      : undefined,
  };
}

async function publicTwoFactorRequest<T, K extends object>(
  request: Request,
  path: string,
  body: K,
) {
  const base = resolveApiBase(request);
  const headers = new Headers({
    "Content-Type": "application/json",
  });
  appendRequestCookies(headers, request);

  const response = await fetch(`${base}${path}`, {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify(body),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    code?: string;
    error?: string;
    message?: string;
  };

  if (!response.ok) {
    throw new ProtectedApiError(
      payload.message || payload.error || "Two-factor request failed.",
      response.status,
      payload.code,
      payload,
      response.headers,
    );
  }

  return {
    data: payload as T,
    setCookie: getResponseSetCookies(response.headers),
  };
}

export function getTwoFactorSettings(request: Request) {
  return protectedTwoFactorRequest<AuthTwoFactorSettingsResponse, never>(
    request,
    "/auth/2fa/settings",
  );
}

export function setupTotp(
  request: Request,
  body: AuthTwoFactorTotpSetupRequest,
) {
  return protectedTwoFactorRequest<
    AuthTwoFactorTotpSetupResponse,
    AuthTwoFactorTotpSetupRequest
  >(request, "/auth/2fa/totp/setup", body);
}

export function verifyTotpSetup(
  request: Request,
  body: AuthTwoFactorTotpVerifyRequest,
) {
  return protectedTwoFactorRequest<
    AuthTokenResponse,
    AuthTwoFactorTotpVerifyRequest
  >(request, "/auth/2fa/totp/verify", body);
}

export function sendEmailOtpSetup(request: Request) {
  return protectedTwoFactorRequest<AuthStatusResponse, Record<string, never>>(
    request,
    "/auth/2fa/email/send",
    {},
  );
}

export function verifyEmailOtpSetup(
  request: Request,
  body: AuthTwoFactorEmailVerifyRequest,
) {
  return protectedTwoFactorRequest<
    AuthTokenResponse,
    AuthTwoFactorEmailVerifyRequest
  >(request, "/auth/2fa/email/verify", body);
}

export function disableTotp(request: Request) {
  return protectedTwoFactorRequest<AuthStatusResponse, Record<string, never>>(
    request,
    "/auth/2fa/totp/disable",
    {},
  );
}

export function disableEmailOtp(request: Request) {
  return protectedTwoFactorRequest<AuthStatusResponse, Record<string, never>>(
    request,
    "/auth/2fa/email/disable",
    {},
  );
}

export function sendLoginEmailOtp(
  request: Request,
  body: AuthLoginTwoFactorSessionRequest,
) {
  return publicTwoFactorRequest<
    AuthStatusResponse,
    AuthLoginTwoFactorSessionRequest
  >(request, "/auth/login/2fa/email/send", body);
}

export function verifyLoginEmailOtp(
  request: Request,
  body: AuthLoginTwoFactorEmailVerifyRequest,
) {
  return publicTwoFactorRequest<
    AuthTokenResponse,
    AuthLoginTwoFactorEmailVerifyRequest
  >(request, "/auth/login/2fa/email/verify", body);
}

export function verifyLoginTotp(
  request: Request,
  body: AuthLoginTwoFactorTotpVerifyRequest,
) {
  return publicTwoFactorRequest<
    AuthTokenResponse,
    AuthLoginTwoFactorTotpVerifyRequest
  >(request, "/auth/login/2fa/totp/verify", body);
}
