import { redirect, type ActionFunctionArgs } from "react-router";
import type { ResetPasswordErrors } from "./auth.types";
import {
  AuthApiError,
  formatAuthMessage,
  getAuthFieldError,
  resetPassword,
} from "~/services/auth/api.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const token = String(formData.get("token") || "").trim();
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  const errors: ResetPasswordErrors = {};

  if (!token) errors.token = "Reset token is required";
  if (!newPassword) errors.newPassword = "New password is required";
  else if (newPassword.length < 8) {
    errors.newPassword = "Password must be at least 8 characters";
  }
  if (!confirmPassword) errors.confirmPassword = "Please confirm your password";
  else if (confirmPassword !== newPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (Object.keys(errors).length > 0) return { errors };

  try {
    await resetPassword(token, newPassword, request);
    const params = new URLSearchParams({
      notice: "reset_password_success",
    });
    return redirect(`/login?${params.toString()}`);
  } catch (error) {
    if (error instanceof AuthApiError) {
      if (error.status === 400) {
        const tokenError = formatAuthMessage(
          getAuthFieldError(error.details, "token"),
        );
        const passwordError = formatAuthMessage(
          getAuthFieldError(error.details, "newPassword") ??
            getAuthFieldError(error.details, "password"),
        );

        return {
          errors: {
            token: tokenError,
            newPassword: passwordError,
            form:
              passwordError ??
              tokenError ??
              formatAuthMessage(error.message) ??
              "Unable to reset password.",
          },
        };
      }

      return { errors: { form: formatAuthMessage(error.message) } };
    }

    return {
      errors: {
        form:
          error instanceof Error
            ? formatAuthMessage(`Password reset failed: ${error.message}`)
            : "Password reset failed. Please try again.",
      },
    };
  }
}

export function meta() {
  return [{ title: "Reset Password | True Khmer" }];
}
