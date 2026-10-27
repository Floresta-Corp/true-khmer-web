import { data, type ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { commitAuthToSession } from "~/lib/server/session.server";
import { requireUser } from "~/lib/server/route-guards.server";
import { invalidateAuthSessionCacheForRequest } from "~/services/auth/session.server";
import type { SettingsActionData } from "../types";
import type {
  AuthTwoFactorEmailVerifyRequest,
  AuthTwoFactorTotpVerifyRequest,
} from "~/types/api-client";
import {
  disableEmailOtp,
  disableTotp,
  sendEmailOtpSetup,
  setupTotp,
  verifyEmailOtpSetup,
  verifyTotpSetup,
} from "~/api/two-factor/two-factor.server";
import {
  appendCookie,
  firstFieldError,
  settingsActionError,
} from "./settings-action.server";

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

const DisableSchema = z.object({
  intent: z.enum(["totp-disable", "email-disable"]),
  password: z.string().min(1, "Current password is required."),
});

// Shared by /settings/2fa, /settings/2fa/authenticator and /settings/2fa/email.
export async function settings2faAction({ request }: ActionFunctionArgs) {
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

    if (intent === "totp-disable" || intent === "email-disable") {
      const parsed = DisableSchema.safeParse(formValues);
      if (!parsed.success) {
        return data<SettingsActionData>(
          {
            errors: { password: firstFieldError(parsed.error, "password") },
            intent,
          },
          { status: 400, headers },
        );
      }

      const body = { password: parsed.data.password };
      const result =
        intent === "totp-disable"
          ? await disableTotp(request, body)
          : await disableEmailOtp(request, body);
      appendCookie(headers, result.setCookie);
      await invalidateAuthSessionCacheForRequest(request);
      return data<SettingsActionData>(
        {
          ok: true,
          intent,
          message:
            intent === "totp-disable"
              ? "Authenticator app was disabled."
              : "Email OTP was disabled.",
        },
        { headers },
      );
    }

    return data<SettingsActionData>(
      { errors: { form: "Unsupported settings action." } },
      { status: 400, headers },
    );
  } catch (error) {
    // The disable endpoints answer 400 for a wrong (or unset) password.
    if (
      (intent === "totp-disable" || intent === "email-disable") &&
      error instanceof ProtectedApiError &&
      error.status === 400
    ) {
      return data<SettingsActionData>(
        { intent, errors: { password: error.message } },
        { status: error.status, headers },
      );
    }

    return settingsActionError(request, error, intent, headers);
  }
}
