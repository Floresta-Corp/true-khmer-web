import { resolveApiBase } from "~/lib/server/api-base.server";

export type BackendUser = {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  avatar?: string;
  gender?: string;
  [key: string]: unknown;
};

export type AuthenticatedBackendUser = BackendUser & {
  id: string;
};

export type AuthTokensResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthenticatedBackendUser;
};

type RegisterRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  occupation: string;
};

type RegisterResponse = {
  success: boolean;
  message: string;
  otpSent: boolean;
  user: BackendUser;
};

type ResendRegisterOtpResponse = {
  success: boolean;
  message: string;
};

export class AuthApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.details = details;
  }
}

type AuthValidationDetails = {
  fieldErrors?: Record<string, unknown>;
};

export function getAuthFieldError(details: unknown, field: string) {
  if (!details || typeof details !== "object") return undefined;
  const fieldErrors = (details as AuthValidationDetails).fieldErrors;
  if (!fieldErrors || typeof fieldErrors !== "object") return undefined;
  const message = fieldErrors[field];
  return typeof message === "string" ? message : undefined;
}

async function authRequest<T>(
  path: string,
  body: Record<string, unknown>,
  request?: Request,
) {
  const base = resolveApiBase(request);
  const url = `${base}${path}`;
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : "Unknown network error";
    throw new Error(`Cannot reach auth API at ${url}. ${reason}`);
  }

  const data = (await response.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;

  if (!response.ok) {
    const message =
      (typeof data.message === "string" && data.message) ||
      "Authentication request failed.";
    throw new AuthApiError(message, response.status, data);
  }

  return data as T;
}

export async function registerUser(
  payload: RegisterRequest,
  request?: Request,
) {
  return authRequest<RegisterResponse>("/auth/register", payload, request);
}

export async function verifyRegisterOtp(
  email: string,
  otp: string,
  request?: Request,
) {
  return authRequest<AuthTokensResponse>(
    "/auth/register/verify-otp",
    { email, otp },
    request,
  );
}

export async function resendRegisterOtp(email: string, request?: Request) {
  return authRequest<ResendRegisterOtpResponse>(
    "/auth/register/resend-otp",
    { email },
    request,
  );
}

export async function loginUser(
  email: string,
  password: string,
  request?: Request,
) {
  return authRequest<AuthTokensResponse>(
    "/auth/login",
    { email, password },
    request,
  );
}

export async function refreshAccessToken(
  refreshToken: string,
  request?: Request,
) {
  return authRequest<Pick<AuthTokensResponse, "accessToken" | "refreshToken">>(
    "/auth/refresh",
    { refreshToken },
    request,
  );
}
