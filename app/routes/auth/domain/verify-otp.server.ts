import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import type { VerifyOtpErrors } from "./auth.types";
import {
  AuthApiError,
  getAuthFieldError,
  resendRegisterOtp,
  verifyRegisterOtp,
} from "~/services/auth/api.server";
import { createUserSession } from "~/lib/server/session.server";
import { redirectIfAuthenticated } from "~/lib/server/route-guards.server";
import { sanitizeRedirectPath } from "~/lib/redirects";
import { destinationAfterAuth } from "./auth-flow.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const authRedirect = await redirectIfAuthenticated(request);
  if (authRedirect) throw authRedirect;
  return {};
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent") || "verify");
  const email = String(formData.get("email") || "");
  const otp = String(formData.get("otp") || "");
  const redirectTo = sanitizeRedirectPath(
    formData.get("redirectTo")?.toString(),
  );

  if (intent === "resend") {
    const errors: VerifyOtpErrors = {};

    if (!email) errors.email = "Email is required";
    if (Object.keys(errors).length > 0) return { errors };

    try {
      await resendRegisterOtp(email, request);
      return {
        resend: {
          success: true,
          message: "A new verification code has been sent to your email.",
        },
      };
    } catch (error) {
      if (error instanceof AuthApiError) {
        if (error.status === 400) {
          return {
            errors: {
              email: getAuthFieldError(error.details, "email"),
              form: error.message,
            },
          };
        }

        if (error.status === 404) {
          throw redirect("/register");
        }

        if (error.status === 409) {
          throw redirect("/login");
        }

        return { errors: { form: error.message } };
      }

      return {
        errors: {
          form:
            error instanceof Error
              ? `Could not resend OTP: ${error.message}`
              : "Could not resend OTP. Please try again.",
        },
      };
    }
  }

  const errors: VerifyOtpErrors = {};

  if (!email) errors.email = "Email is required";
  if (!otp) errors.otp = "OTP is required";
  else if (!/^\d{6}$/.test(otp)) errors.otp = "OTP must be 6 digits";

  if (Object.keys(errors).length > 0) return { errors };

  try {
    const auth = await verifyRegisterOtp(email, otp, request);
    return createUserSession(
      request,
      auth,
      destinationAfterAuth(auth.authFlow, redirectTo),
    );
  } catch (error) {
    if (error instanceof AuthApiError) {
      if (error.status === 400) {
        const otpFieldError = getAuthFieldError(error.details, "otp");
        const emailFieldError = getAuthFieldError(error.details, "email");

        const normalizedMessage =
          error.message === "Authentication request failed." ||
          error.message === "Validation failed."
            ? "Incorrect OTP."
            : error.message;

        return {
          errors: {
            email: emailFieldError,
            otp: otpFieldError,
            form: otpFieldError ? normalizedMessage : "Incorrect OTP.",
          },
        };
      }

      if (error.status === 401) {
        return { errors: { form: "Incorrect OTP." } };
      }

      return { errors: { form: error.message } };
    }

    return {
      errors: {
        form:
          error instanceof Error
            ? `OTP verification failed: ${error.message}`
            : "OTP verification failed. Please try again.",
      },
    };
  }
}

export function meta() {
  return [{ title: "Verify OTP | True Khmer" }];
}
