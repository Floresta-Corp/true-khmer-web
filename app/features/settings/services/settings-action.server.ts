import { data } from "react-router";
import type { z } from "zod";
import {
  AuthSessionExpiredError,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import { clearAndRedirectToLogin } from "~/lib/server/route-guards.server";
import type { SettingsActionData } from "../types";

export function appendCookie(headers: Headers, setCookie?: string | string[]) {
  if (!setCookie) return;
  for (const cookie of Array.isArray(setCookie) ? setCookie : [setCookie]) {
    headers.append("Set-Cookie", cookie);
  }
}

export function firstFieldError(
  error: z.ZodError,
  field:
    | "oldPassword"
    | "password"
    | "newPassword"
    | "confirmPassword"
    | "code",
) {
  return error.issues.find((issue) => issue.path[0] === field)?.message;
}

function errorMessage(error: unknown) {
  if (error instanceof ProtectedApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Unable to update account settings.";
}

export function settingsActionError(
  request: Request,
  error: unknown,
  intent: string,
  headers: Headers,
) {
  if (error instanceof Response) throw error;
  if (error instanceof AuthSessionExpiredError) {
    return clearAndRedirectToLogin(request);
  }

  return data<SettingsActionData>(
    { intent, errors: { form: errorMessage(error) } },
    {
      status: error instanceof ProtectedApiError ? error.status : 500,
      headers,
    },
  );
}
