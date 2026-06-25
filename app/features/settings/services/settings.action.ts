import { data } from "react-router";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { commitAuthToSession } from "~/lib/server/session.server";
import { requireUser } from "~/lib/server/route-guards.server";
import { invalidateAuthSessionCacheForRequest } from "~/services/auth/session.server";
import type { Route } from "project-types/settings/routes/+types/settings";
import type {
  AuthTwoFactorEmailVerifyRequest,
  AuthTwoFactorTotpSetupResponse,
  AuthTwoFactorTotpVerifyRequest,
} from "~/types/api-client";
import {
  disableEmailOtp,
  disableTotp,
  sendEmailOtpSetup,
  setupTotp,
  verifyEmailOtpSetup,
  verifyTotpSetup,
} from "~/services/api/two-factor/two-factor.server";

export type SettingsActionData = {
  ok?: boolean;
  intent?: string;
  message?: string;
  setup?: AuthTwoFactorTotpSetupResponse;
  errors?: {
    password?: string;
    code?: string;
    form?: string;
  };
};

function appendCookie(headers: Headers, setCookie?: string | string[]) {
  if (!setCookie) return;
  for (const cookie of Array.isArray(setCookie) ? setCookie : [setCookie]) {
    headers.append("Set-Cookie", cookie);
  }
}

function errorMessage(error: unknown) {
  if (error instanceof ProtectedApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Unable to update two-factor authentication.";
}

function validateCode(code: string) {
  return /^\d{6}$/.test(code);
}

export async function action({ request }: Route.ActionArgs) {
  const auth = await requireUser(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent") || "");
  const headers = new Headers();
  appendCookie(headers, auth.setCookie);

  try {
    if (intent === "totp-setup") {
      const password = String(formData.get("password") || "");
      if (!password) {
        return data<SettingsActionData>(
          { errors: { password: "Current password is required." }, intent },
          { status: 400, headers },
        );
      }

      const result = await setupTotp(request, { password });
      appendCookie(headers, result.setCookie);
      return data<SettingsActionData>(
        {
          ok: true,
          intent,
          setup: result.data,
          message: "Scan the QR code URI or enter it in your authenticator app.",
        },
        { headers },
      );
    }

    if (intent === "totp-verify") {
      const code = String(formData.get("code") || "").trim();
      const trustDevice = formData.get("trustDevice") === "true";
      if (!validateCode(code)) {
        return data<SettingsActionData>(
          { errors: { code: "Enter the 6-digit authenticator code." }, intent },
          { status: 400, headers },
        );
      }

      const result = await verifyTotpSetup(request, {
        code,
        trustDevice,
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
      const result = await sendEmailOtpSetup(request);
      appendCookie(headers, result.setCookie);
      return data<SettingsActionData>(
        { ok: true, intent, message: "A verification code was sent to your email." },
        { headers },
      );
    }

    if (intent === "email-verify") {
      const code = String(formData.get("code") || "").trim();
      const trustDevice = formData.get("trustDevice") === "true";
      if (!validateCode(code)) {
        return data<SettingsActionData>(
          { errors: { code: "Enter the 6-digit email code." }, intent },
          { status: 400, headers },
        );
      }

      const result = await verifyEmailOtpSetup(request, {
        code,
        trustDevice,
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
      const result = await disableTotp(request);
      appendCookie(headers, result.setCookie);
      await invalidateAuthSessionCacheForRequest(request);
      return data<SettingsActionData>(
        { ok: true, intent, message: "Authenticator app was disabled." },
        { headers },
      );
    }

    if (intent === "email-disable") {
      const result = await disableEmailOtp(request);
      appendCookie(headers, result.setCookie);
      await invalidateAuthSessionCacheForRequest(request);
      return data<SettingsActionData>(
        { ok: true, intent, message: "Email OTP was disabled." },
        { headers },
      );
    }

    return data<SettingsActionData>(
      { errors: { form: "Unsupported two-factor action." } },
      { status: 400, headers },
    );
  } catch (error) {
    return data<SettingsActionData>(
      { intent, errors: { form: errorMessage(error) } },
      { status: error instanceof ProtectedApiError ? error.status : 500, headers },
    );
  }
}
