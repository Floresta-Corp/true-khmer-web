import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import type { ForgotPasswordErrors } from "./auth.types";
import {
  AuthApiError,
  formatAuthMessage,
  getAuthFieldError,
  requestPasswordReset,
} from "~/services/auth.server";
import { redirectIfAuthenticated } from "~/lib/server/route-guards.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const authRedirect = await redirectIfAuthenticated(request);
  if (authRedirect) throw authRedirect;
  return {};
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "").trim();

  const errors: ForgotPasswordErrors = {};

  if (!email) errors.email = "Email is required";
  else if (!email.includes("@")) errors.email = "Must be a valid email";

  if (Object.keys(errors).length > 0) return { errors };

  const resetPageUrl = new URL("/reset-password", request.url).toString();

  try {
    const response = await requestPasswordReset(email, resetPageUrl, request);
    const params = new URLSearchParams({
      email,
      message:
        response.message || "We’ve sent a password reset link to your email.",
    });

    return redirect(`/forgot-password/check-email?${params.toString()}`);
  } catch (error) {
    if (error instanceof AuthApiError) {
      if (error.status === 400) {
        const emailError = formatAuthMessage(
          getAuthFieldError(error.details, "email"),
        );

        return {
          errors: {
            email: emailError,
            form: emailError ?? formatAuthMessage(error.message),
          },
        };
      }

      return { errors: { form: formatAuthMessage(error.message) } };
    }

    return {
      errors: {
        form:
          error instanceof Error
            ? formatAuthMessage(`Could not send reset email: ${error.message}`)
            : "Could not send reset email. Please try again.",
      },
    };
  }
}

export function meta() {
  return [{ title: "Forgot Password | True Khmer" }];
}
