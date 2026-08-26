import { data } from "react-router";
import { z } from "zod";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { commitAuthToSession } from "~/lib/server/session.server";
import { requireUser } from "~/lib/server/route-guards.server";
import { invalidateAuthSessionCacheForRequest } from "~/services/auth/session.server";
import type { Route } from "project-types/settings/route/+types/settings";
import type { SettingsActionData } from "../types";
import type {
  AuthTwoFactorEmailVerifyRequest,
  AuthTwoFactorTotpVerifyRequest,
} from "~/types/api-client";
export type { SettingsActionData } from "../types";
import { changePassword } from "~/api/auth/auth.server";
import {
  disableEmailOtp,
  disableTotp,
  sendEmailOtpSetup,
  setupTotp,
  verifyEmailOtpSetup,
  verifyTotpSetup,
} from "~/api/two-factor/two-factor.server";
import { getPasswordValidationError } from "~/routes/auth/domain/password-validation";

const sixDigitCodeSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, "Enter the 6-digit verification code.");

const TotpSetupSchema = z.object({
  intent: z.literal("totp-setup"),
  password: z.string().min(1, "Current password is required."),
});

const TotpVerifySchema = z.object({
  intent: z.literal("totp-verify"),
  code: sixDigitCodeSchema,
  trustDevice: z.enum(["true", "false"]).optional(),
});

const EmailSendSchema = z.object({
  intent: z.literal("email-send"),
});

const EmailVerifySchema = z.object({
  intent: z.literal("email-verify"),
  code: sixDigitCodeSchema,
  trustDevice: z.enum(["true", "false"]).optional(),
});

const TotpDisableSchema = z.object({
  intent: z.literal("totp-disable"),
});

const EmailDisableSchema = z.object({
  intent: z.literal("email-disable"),
});

const ChangePasswordSchema = z
  .object({
    intent: z.literal("change-password"),
    oldPassword: z.string().optional(),
    newPassword: z.string().min(1, "New password is required."),
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .superRefine((values, context) => {
    const passwordError = getPasswordValidationError(values.newPassword);
    if (passwordError) {
      context.addIssue({
        code: "custom",
        path: ["newPassword"],
        message: passwordError,
      });
    }

    if (
      values.newPassword &&
      values.confirmPassword &&
      values.newPassword !== values.confirmPassword
    ) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }
  });

function appendCookie(headers: Headers, setCookie?: string | string[]) {
  if (!setCookie) return;
  for (const cookie of Array.isArray(setCookie) ? setCookie : [setCookie]) {
    headers.append("Set-Cookie", cookie);
  }
}

function errorMessage(error: unknown) {
  if (error instanceof ProtectedApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Unable to update account settings.";
}

function firstFieldError(
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

export async function settingsAction({ request }: Route.ActionArgs) {
  const auth = await requireUser(request);
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData);
  const intent = String(formValues.intent || "");
  const headers = new Headers();
  appendCookie(headers, auth.setCookie);

  try {
    if (intent === "totp-setup") {
      const parsed = TotpSetupSchema.safeParse(formValues);
      if (!parsed.success) {
        return data<SettingsActionData>(
          {
            errors: {
              password: firstFieldError(parsed.error, "password"),
            },
            intent,
          },
          { status: 400, headers },
        );
      }

      const result = await setupTotp(request, {
        password: parsed.data.password,
      });
      appendCookie(headers, result.setCookie);
      return data<SettingsActionData>(
        {
          ok: true,
          intent,
          setup: result.data,
          message:
            "Scan the QR code URI or enter it in your authenticator app.",
        },
        { headers },
      );
    }

    if (intent === "totp-verify") {
      const parsed = TotpVerifySchema.safeParse(formValues);
      if (!parsed.success) {
        return data<SettingsActionData>(
          {
            errors: {
              code:
                firstFieldError(parsed.error, "code") ??
                "Enter the 6-digit authenticator code.",
            },
            intent,
          },
          { status: 400, headers },
        );
      }

      const result = await verifyTotpSetup(request, {
        code: parsed.data.code,
        trustDevice: parsed.data.trustDevice === "true",
      } as AuthTwoFactorTotpVerifyRequest);
      const sessionHeaders = await commitAuthToSession(request, result.data);
      appendCookie(headers, sessionHeaders.get("Set-Cookie") ?? undefined);
      await invalidateAuthSessionCacheForRequest(request);
      return data<SettingsActionData>(
        { ok: true, intent, message: "Authenticator app is now enabled." },
        { headers },
      );
    }

    if (intent === "email-send") {
      const parsed = EmailSendSchema.safeParse(formValues);
      if (!parsed.success) {
        return data<SettingsActionData>(
          { errors: { form: "Invalid email OTP request." }, intent },
          { status: 400, headers },
        );
      }

      const result = await sendEmailOtpSetup(request);
      appendCookie(headers, result.setCookie);
      return data<SettingsActionData>(
        {
          ok: true,
          intent,
          message: "A verification code was sent to your email.",
        },
        { headers },
      );
    }

    if (intent === "email-verify") {
      const parsed = EmailVerifySchema.safeParse(formValues);
      if (!parsed.success) {
        return data<SettingsActionData>(
          {
            errors: {
              code:
                firstFieldError(parsed.error, "code") ??
                "Enter the 6-digit email code.",
            },
            intent,
          },
          { status: 400, headers },
        );
      }

      const result = await verifyEmailOtpSetup(request, {
        code: parsed.data.code,
        trustDevice: parsed.data.trustDevice === "true",
      } as AuthTwoFactorEmailVerifyRequest);
      const sessionHeaders = await commitAuthToSession(request, result.data);
      appendCookie(headers, sessionHeaders.get("Set-Cookie") ?? undefined);
      await invalidateAuthSessionCacheForRequest(request);
      return data<SettingsActionData>(
        { ok: true, intent, message: "Email OTP is now enabled." },
        { headers },
      );
    }

    if (intent === "totp-disable") {
      const parsed = TotpDisableSchema.safeParse(formValues);
      if (!parsed.success) {
        return data<SettingsActionData>(
          {
            errors: { form: "Invalid authenticator disable request." },
            intent,
          },
          { status: 400, headers },
        );
      }

      const result = await disableTotp(request);
      appendCookie(headers, result.setCookie);
      await invalidateAuthSessionCacheForRequest(request);
      return data<SettingsActionData>(
        { ok: true, intent, message: "Authenticator app was disabled." },
        { headers },
      );
    }

    if (intent === "email-disable") {
      const parsed = EmailDisableSchema.safeParse(formValues);
      if (!parsed.success) {
        return data<SettingsActionData>(
          { errors: { form: "Invalid email OTP disable request." }, intent },
          { status: 400, headers },
        );
      }

      const result = await disableEmailOtp(request);
      appendCookie(headers, result.setCookie);
      await invalidateAuthSessionCacheForRequest(request);
      return data<SettingsActionData>(
        { ok: true, intent, message: "Email OTP was disabled." },
        { headers },
      );
    }

    if (intent === "change-password") {
      const parsed = ChangePasswordSchema.safeParse(formValues);
      if (!parsed.success) {
        return data<SettingsActionData>(
          {
            errors: {
              oldPassword: firstFieldError(parsed.error, "oldPassword"),
              newPassword: firstFieldError(parsed.error, "newPassword"),
              confirmPassword: firstFieldError(parsed.error, "confirmPassword"),
            },
            intent,
          },
          { status: 400, headers },
        );
      }

      if (auth.user.setupNewPassword !== true && !parsed.data.oldPassword) {
        return data<SettingsActionData>(
          {
            errors: { oldPassword: "Current password is required." },
            intent,
          },
          { status: 400, headers },
        );
      }

      const result = await changePassword(
        request,
        parsed.data.oldPassword
          ? {
              oldPassword: parsed.data.oldPassword,
              newPassword: parsed.data.newPassword,
            }
          : {
              newPassword: parsed.data.newPassword,
            },
      );
      appendCookie(headers, result.setCookie);
      await invalidateAuthSessionCacheForRequest(request);
      return data<SettingsActionData>(
        {
          ok: true,
          intent,
          message: result.data.message || "Password changed successfully.",
        },
        { headers },
      );
    }

    return data<SettingsActionData>(
      { errors: { form: "Unsupported settings action." } },
      { status: 400, headers },
    );
  } catch (error) {
    if (
      intent === "change-password" &&
      error instanceof ProtectedApiError &&
      (error.code === "OLD_PASSWORD_REQUIRED" ||
        error.code === "INVALID_OLD_PASSWORD")
    ) {
      return data<SettingsActionData>(
        { intent, errors: { oldPassword: error.message } },
        { status: error.status, headers },
      );
    }

    return data<SettingsActionData>(
      { intent, errors: { form: errorMessage(error) } },
      {
        status: error instanceof ProtectedApiError ? error.status : 500,
        headers,
      },
    );
  }
}
