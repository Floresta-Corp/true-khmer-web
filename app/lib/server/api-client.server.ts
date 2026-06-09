import { redirect } from "react-router";
import { accessErrorCodeFromPayload } from "~/lib/server/auth/access-control.server";
import { resolveApiBase } from "~/lib/server/api-base.server";
import {
  commitSession,
  destroySession,
  getSession,
  isAutoRefreshEnabled,
} from "~/lib/server/session.server";
import { refreshAccessToken } from "~/services/auth/api.server";

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

export class ProtectedApiError extends Error {
  status: number;
  code?: string;
  details?: JsonValue;

  constructor(
    message: string,
    status: number,
    code?: string,
    details?: JsonValue,
  ) {
    super(message);
    this.name = "ProtectedApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class AuthSessionExpiredError extends Error {
  constructor(message = "Session expired. Please log in again.") {
    super(message);
    this.name = "AuthSessionExpiredError";
  }
}

export class InvalidApiResponseError extends Error {
  status: number;
  statusText: string;
  contentType: string | null;

  constructor(response: Response) {
    super(
      `Expected a JSON object response but received invalid JSON (${response.status} ${response.statusText}).`,
    );
    this.name = "InvalidApiResponseError";
    this.status = response.status;
    this.statusText = response.statusText;
    this.contentType = response.headers.get("Content-Type");
  }
}

type RequestOptions<K extends object = JsonObject> = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: K | undefined;
};

export type ApiResult<T> = {
  data: T;
  setCookie?: string;
};

function isJsonObject(value: JsonValue): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function parseJson(response: Response): Promise<JsonObject> {
  if (response.status === 204 || response.status === 205) {
    return {};
  }

  const rawBody = await response.text();
  if (!rawBody.trim()) {
    return {};
  }

  try {
    const payload = JSON.parse(rawBody) as JsonValue;
    if (isJsonObject(payload)) {
      return payload;
    }

    if (!response.ok) {
      return {};
    }
  } catch {
    if (!response.ok) {
      return {};
    }
  }

  throw new InvalidApiResponseError(response);
}

async function fetchWithBearer<K extends object = JsonObject>(
  request: Request,
  path: string,
  accessToken: string,
  options: RequestOptions<K> = {},
) {
  const base = resolveApiBase(request);
  const url = `${base}${path}`;

  return fetch(url, {
    method: options.method ?? "GET",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
}

function readErrorMessage(payload: JsonObject, fallback: string) {
  return (
    (typeof payload.message === "string" && payload.message) ||
    (typeof payload.error === "string" && payload.error) ||
    fallback
  );
}

export async function apiRequestWithSession<T, K extends object = JsonObject>(
  request: Request,
  path: string,
  options: RequestOptions<K> = {},
): Promise<ApiResult<T>> {
  const session = await getSession(request);
  let accessToken = session.get("accessToken") as string | undefined;
  const refreshToken = session.get("refreshToken") as string | undefined;

  if (!accessToken) {
    throw new AuthSessionExpiredError();
  }

  let response = await fetchWithBearer(request, path, accessToken, options);
  let setCookie: string | undefined;

  if (response.status === 401) {
    if (!refreshToken || !isAutoRefreshEnabled(session)) {
      throw new AuthSessionExpiredError();
    }

    try {
      const refreshed = await refreshAccessToken(refreshToken, request);
      accessToken = refreshed.accessToken;
      session.set("accessToken", refreshed.accessToken);
      session.set("refreshToken", refreshed.refreshToken);
      setCookie = await commitSession(session);
    } catch {
      throw redirect("/login", {
        headers: { "Set-Cookie": await destroySession(session) },
      });
    }

    response = await fetchWithBearer(request, path, accessToken, options);
  }

  const payload = await parseJson(response);
  if (!response.ok) {
    throw new ProtectedApiError(
      readErrorMessage(payload, "API request failed."),
      response.status,
      accessErrorCodeFromPayload(payload),
      payload,
    );
  }

  return {
    data: payload as T,
    setCookie,
  };
}

export async function apiRequestPublic<T, K extends object = JsonObject>(
  request: Request,
  path: string,
  options: RequestOptions<K> = {},
): Promise<ApiResult<T>> {
  const base = resolveApiBase(request);
  const url = `${base}${path}`;

  const response = await fetch(url, {
    method: options.method ?? "GET",
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });

  const payload = await parseJson(response);
  if (!response.ok) {
    throw new ProtectedApiError(
      readErrorMessage(payload, "API request failed."),
      response.status,
      accessErrorCodeFromPayload(payload),
      payload,
    );
  }

  return { data: payload as T };
}

function isLoginRedirectResponse(error: unknown): error is Response {
  if (!(error instanceof Response)) return false;
  const location = error.headers.get("Location") ?? "";
  return (
    error.status >= 300 && error.status < 400 && location.startsWith("/login")
  );
}

export async function apiRequestWithOptionalSession<
  T,
  K extends object = JsonObject,
>(
  request: Request,
  path: string,
  options: RequestOptions<K> = {},
): Promise<ApiResult<T>> {
  try {
    return await apiRequestWithSession<T, K>(request, path, options);
  } catch (error) {
    if (error instanceof AuthSessionExpiredError) {
      return apiRequestPublic<T, K>(request, path, options);
    }

    if (isLoginRedirectResponse(error)) {
      const fallback = await apiRequestPublic<T, K>(request, path, options);
      return {
        ...fallback,
        setCookie: error.headers.get("Set-Cookie") ?? undefined,
      };
    }

    throw error;
  }
}

export async function apiRequestWithAccessToken<
  T,
  K extends object = JsonObject,
>(
  request: Request,
  accessToken: string,
  path: string,
  options: RequestOptions<K> = {},
) {
  const response = await fetchWithBearer(request, path, accessToken, options);
  const payload = await parseJson(response);

  if (!response.ok) {
    throw new ProtectedApiError(
      readErrorMessage(payload, "API request failed."),
      response.status,
      accessErrorCodeFromPayload(payload),
      payload,
    );
  }

  return payload as T;
}
