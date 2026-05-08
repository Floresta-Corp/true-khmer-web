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
  phoneNumber: string;
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

type ForgotPasswordResponse = {
  success: true;
  message: string;
};

type ResetPasswordResponse = {
  success: true;
  message: string;
};

export class AuthApiError extends Error {
  status: number;
  details?: AuthErrorDetails;

  constructor(message: string, status: number, details?: AuthErrorDetails) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.details = details;
  }
}

export type AuthErrorDetails = {
  code?: string;
  fieldErrors?: Record<string, string>;
  message?: string;
  otpSent?: boolean;
};

type AuthErrorResponse = {
  code?: string;
  details?: AuthErrorDetails & {
    fieldErrors?: Record<string, unknown>;
    errors?: unknown;
  };
  error?: string;
  fieldErrors?: Record<string, unknown>;
  message?: unknown;
  otpSent?: boolean;
  errors?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object") return false;
  return !Array.isArray(value);
}

function normalizeAuthMessageValue(value: unknown): string | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return undefined;

    if (
      (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
      (trimmed.startsWith("{") && trimmed.endsWith("}"))
    ) {
      try {
        const parsed = JSON.parse(trimmed) as unknown;
        const parsedMessage = normalizeAuthMessageValue(parsed);
        if (parsedMessage) return parsedMessage;
      } catch {
        // Fall through to the raw string when the API message only looks like JSON.
      }
    }

    return trimmed;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value
      .map((entry) => normalizeAuthMessageValue(entry))
      .filter((entry): entry is string => !!entry)
      .join(" ");
  }
  if (isRecord(value)) {
    const preferredValue =
      value.message ??
      value.error ??
      value.detail ??
      value.description ??
      value.errors;
    const normalizedPreferred = normalizeAuthMessageValue(preferredValue);
    if (normalizedPreferred) return normalizedPreferred;

    return Object.values(value)
      .map((entry) => normalizeAuthMessageValue(entry))
      .filter((entry): entry is string => !!entry)
      .join(" ");
  }

  return undefined;
}

function normalizeFieldErrors(value: unknown) {
  if (!isRecord(value)) return undefined;

  const normalized = Object.entries(value).reduce<Record<string, string>>(
    (errors, [field, errorValue]) => {
      const message = normalizeAuthMessageValue(errorValue);
      if (message) errors[field] = message;
      return errors;
    },
    {},
  );

  return Object.keys(normalized).length > 0 ? normalized : undefined;
}

function normalizeAuthErrorDetails(data: AuthErrorResponse): AuthErrorDetails {
  const nestedDetails = data.details;
  const fieldErrors = nestedDetails?.fieldErrors ?? data.fieldErrors;

  return {
    code: nestedDetails?.code ?? data.code,
    fieldErrors: normalizeFieldErrors(fieldErrors),
    message: normalizeAuthMessageValue(
      nestedDetails?.message ??
        data.message ??
        data.error ??
        nestedDetails?.errors ??
        data.errors,
    ),
    otpSent: nestedDetails?.otpSent ?? data.otpSent,
  };
}

export function getAuthFieldError(
  details: AuthErrorDetails | undefined,
  field: string,
) {
  return details?.fieldErrors?.[field];
}

export function getAuthErrorCode(details: AuthErrorDetails | undefined) {
  return details?.code;
}

export function getAuthErrorMessage(details: AuthErrorDetails | undefined) {
  return details?.message;
}

const authMessageRules: Array<{
  pattern: RegExp;
  replacement: string | ((match: RegExpMatchArray) => string);
}> = [
    {
      pattern: /^authentication request failed\.?$/i,
      replacement: "We couldn't complete your request. Please try again.",
    },
    {
      pattern: /^validation failed\.?$/i,
      replacement: "Please check your information and try again.",
    },
    {
      pattern: /^password must contain at least one lowercase letter\.?$/i,
      replacement: "Password must include at least one lowercase letter.",
    },
    {
      pattern: /^password must contain at least one uppercase letter\.?$/i,
      replacement: "Password must include at least one uppercase letter.",
    },
    {
      pattern: /^password must contain at least one special character\.?$/i,
      replacement: "Password must include at least one special character.",
    },
    {
      pattern: /^password must not contain whitespace\.?$/i,
      replacement: "Password must not contain spaces.",
    },
    {
      pattern: /^password must be at least (\d+) characters?(?: long)?\.?$/i,
      replacement: (match) =>
        `Password must be at least ${match[1]} characters long.`,
    },
  ];

export function formatAuthMessage(message?: string) {
  if (!message) return undefined;

  const normalized = message.trim().replace(/\s+/g, " ");
  if (!normalized) return undefined;

  for (const rule of authMessageRules) {
    const match = normalized.match(rule.pattern);
    if (!match) continue;
    return typeof rule.replacement === "function"
      ? rule.replacement(match)
      : rule.replacement;
  }

  const readableMessage = normalized
    .replace(/\bfirstName\b/g, "First name")
    .replace(/\blastName\b/g, "Last name")
    .replace(/\bphoneNumber\b/g, "Phone number");
  const sentence =
    readableMessage.charAt(0).toUpperCase() + readableMessage.slice(1);

  return /[.!?]$/.test(sentence) ? sentence : `${sentence}.`;
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
      credentials: "include",
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

  const data = (await response.json().catch(() => ({}))) as AuthErrorResponse;

  if (!response.ok) {
    const details = normalizeAuthErrorDetails(data);
    const message = details.message || "Authentication request failed.";
    throw new AuthApiError(message, response.status, details);
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

export async function requestPasswordReset(
  email: string,
  resetPageUrl: string,
  request?: Request,
) {
  return authRequest<ForgotPasswordResponse>(
    "/auth/forgot-password",
    { email, resetPageUrl },
    request,
  );
}

export async function resetPassword(
  token: string,
  newPassword: string,
  request?: Request,
) {
  return authRequest<ResetPasswordResponse>(
    "/auth/reset-password",
    { token, newPassword },
    request,
  );
}
