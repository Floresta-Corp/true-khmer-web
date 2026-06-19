import { z } from "zod";
import type { ActionFunctionArgs } from "react-router";
import type { AdminLoginRequest } from "~/types/api-client";

import { sanitizeRedirectPath } from "~/lib/redirects";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { createAdminPendingLogin } from "~/lib/server/session.server";
import { loginAdmin } from "~/services/api/admin/auth/admin-auth.server";

export type AdminLoginFieldErrors = Partial<
  Record<keyof AdminLoginRequest | "form", string>
>;

export type AdminLoginActionData = {
  errors?: AdminLoginFieldErrors;
  retryAfterSeconds?: number;
};

const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address").max(255),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.coerce.boolean().optional(),
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

function adminLoginError(error: unknown): AdminLoginActionData {
  if (error instanceof ProtectedApiError) {
    if (error.status === 401) {
      return { errors: { form: "Invalid email or password." } };
    }
    if (error.status === 429) {
      return {
        retryAfterSeconds: retryAfterSeconds(error),
        errors: {
          form: "Too many attempts. Please wait before trying again.",
        },
      };
    }
    if (error.status === 500) {
      return {
        errors: {
          form: "The OTP email could not be sent. Please try again.",
        },
      };
    }
    return {
      errors: { form: "Unable to sign in right now. Please try again." },
    };
  }

  return {
    errors: {
      form:
        error instanceof Error
          ? `Login failed: ${error.message}`
          : "Login failed. Please try again.",
    },
  };
}

export async function adminLoginAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const parseResult = adminLoginSchema.safeParse(Object.fromEntries(formData));

  if (!parseResult.success) {
    const fieldErrors = parseResult.error.flatten().fieldErrors;
    return {
      errors: {
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      } as AdminLoginFieldErrors,
    };
  }

  const { email, password, rememberMe, redirectTo } = parseResult.data;
  const sanitizedRedirectTo = sanitizeRedirectPath(redirectTo, "/tk-admin");

  try {
    const challenge = await loginAdmin(request, email, password);
    return createAdminPendingLogin(
      request,
      {
        challengeId: challenge.challengeId,
        expiresAt: challenge.expiresAt,
        rememberMe: rememberMe === true,
      },
      `/tk-admin/login/otp?redirectTo=${encodeURIComponent(
        sanitizedRedirectTo || "/tk-admin",
      )}`,
    );
  } catch (error) {
    return adminLoginError(error);
  }
}
