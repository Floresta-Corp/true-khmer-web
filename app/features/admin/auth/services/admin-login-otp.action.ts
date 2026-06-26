import { z } from "zod";
import { data, type ActionFunctionArgs } from "react-router";
import type { AdminVerifyLoginOtpRequest } from "~/types/api-client";

import { sanitizeRedirectPath } from "~/lib/redirects";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import {
  createAdminSession,
  getAdminPendingLogin,
} from "~/lib/server/session.server";
import { verifyAdminLoginOtp } from "~/routes/api/auth/admin-auth.server";

export type AdminOtpFieldErrors = Partial<
  Record<keyof Pick<AdminVerifyLoginOtpRequest, "otp"> | "form", string>
>;

export type AdminOtpActionData = {
  errors?: AdminOtpFieldErrors;
  challengeExhausted?: boolean;
  retryAfterSeconds?: number;
};

const adminOtpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "Enter the six-digit code."),
  redirectTo: z.string().optional(),
});

function retryAfterSeconds(error: ProtectedApiError) {
  const retryAfter = error.headers.get("Retry-After");
  if (!retryAfter) return undefined;

  const seconds = Number(retryAfter);
  if (Number.isFinite(seconds) && seconds > 0) {
    return Math.ceil(seconds);
  }

  const retryAt = Date.parse(retryAfter);
  if (!Number.isNaN(retryAt)) {
    return Math.max(Math.ceil((retryAt - Date.now()) / 1000), 0);
  }

  return undefined;
}

function adminOtpError(error: unknown): AdminOtpActionData {
  if (error instanceof ProtectedApiError) {
    if (error.status === 429) {
      return {
        challengeExhausted: true,
        retryAfterSeconds: retryAfterSeconds(error),
        errors: {
          form:
            "Too many failed attempts. Please sign in again to get a new code.",
        },
      };
    }
    if (error.status === 401) {
      return {
        errors: {
          form:
            "The code is invalid, expired, already used, or has too many failed attempts.",
        },
      };
    }
    return {
      errors: { form: "Unable to verify the code right now. Please try again." },
    };
  }

  return {
    errors: {
      form:
        error instanceof Error
          ? `Verification failed: ${error.message}`
          : "Verification failed. Please try again.",
    },
  };
}

export async function adminOtpAction({ request }: ActionFunctionArgs) {
  const pendingLogin = await getAdminPendingLogin(request);
  if (!pendingLogin) {
    return data<AdminOtpActionData>(
      {
        challengeExhausted: true,
        errors: { form: "Your OTP challenge has expired. Please sign in again." },
      },
      { status: 401 },
    );
  }

  const formData = await request.formData();
  const parseResult = adminOtpSchema.safeParse(Object.fromEntries(formData));

  if (!parseResult.success) {
    const fieldErrors = parseResult.error.flatten().fieldErrors;
    return {
      errors: {
        otp: fieldErrors.otp?.[0],
      } as AdminOtpFieldErrors,
    };
  }

  const redirectTo = sanitizeRedirectPath(parseResult.data.redirectTo, "/tk-admin");

  try {
    const auth = await verifyAdminLoginOtp(
      request,
      pendingLogin.challengeId,
      parseResult.data.otp,
    );

    return createAdminSession(request, auth, redirectTo || "/tk-admin", {
      rememberMe: pendingLogin.rememberMe,
    });
  } catch (error) {
    return adminOtpError(error);
  }
}
