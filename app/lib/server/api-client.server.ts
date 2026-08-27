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
  headers: Headers;

  constructor(
    message: string,
    status: number,
    code?: string,
    details?: JsonValue,
    headers?: Headers,
  ) {
    super(message);
    this.name = "ProtectedApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.headers = headers ?? new Headers();
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
  headers?: Record<string, string>;
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
      ...options.headers,
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
      response.headers,
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
      ...options.headers,
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
      response.headers,
    );
  }

  return { data: payload as T };
}

/**
 * True when a read failed in a way the page can survive: the resource is
 * missing (404) or the service behind it is failing (5xx).
 *
 * Reads that only enrich a page — category lists, tag lists, locations,
 * paginated listings — should degrade rather than take the whole route down
 * with them, and every caller already handles the `null` that 404 produced.
 * A 5xx is logged so the outage is visible rather than silent.
 *
 * Auth and validation failures deliberately return false: those are bugs the
 * caller needs to see, not conditions to paper over. Detail fetches and
 * mutations should not use this at all.
 */
export function isResourceUnavailable(error: unknown, label: string) {
  if (!(error instanceof ProtectedApiError)) return false;
  if (error.status !== 404 && error.status < 500) return false;

  if (error.status >= 500) {
    console.warn(
      `[api] ${label} failed with ${error.status}; rendering without it`,
    );
  }

  return true;
}

/**
 * Runs a read the page can render without, returning `null` when the resource
 * is missing or its service is failing.
 *
 * Prefer this to a bare `try/catch` that logs the error object: a handled
 * degradation should leave one line in the log, not a stack trace and a page of
 * response headers. Anything that is not a 404 or 5xx still throws.
 */
export async function readOptional<T>(
  label: string,
  read: () => Promise<T>,
): Promise<T | null> {
  try {
    return await read();
  } catch (error) {
    if (isResourceUnavailable(error, label)) return null;
    throw error;
  }
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
      response.headers,
    );
  }

  return payload as T;
}
