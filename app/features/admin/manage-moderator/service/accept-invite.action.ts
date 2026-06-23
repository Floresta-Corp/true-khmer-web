import { redirect, type ActionFunctionArgs } from "react-router";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { getPasswordValidationError } from "~/routes/auth/domain/password-validation";
import { verifyModeratorInvite } from "~/services/api/admin/manage-mod-team/manage-moderator.server";

type AcceptInviteErrors = Partial<
  Record<"token" | "name" | "password" | "confirmPassword" | "form", string>
>;

export type AcceptInviteActionData = {
  errors?: AcceptInviteErrors;
};

function inviteErrorMessage(error: unknown) {
  if (error instanceof ProtectedApiError) {
    if (error.status === 400 || error.status === 404 || error.status === 410) {
      return "This invitation link is invalid or has expired. Please ask an admin to send a new invite.";
    }

    return error.message || "Unable to accept invitation. Please try again.";
  }

  return error instanceof Error
    ? `Unable to accept invitation: ${error.message}`
    : "Unable to accept invitation. Please try again.";
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const token = String(formData.get("token") || "").trim();
  const firstName = String(formData.get("firstName") || "").trim();
  const lastName = String(formData.get("lastName") || "").trim();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  const errors: AcceptInviteErrors = {};

  if (!token) errors.token = "Invitation token is required.";
  if (!firstName) errors.name = "First name is required.";
  if (!lastName) errors.name = "Last name is required.";

  const passwordError = getPasswordValidationError(password);
  if (passwordError) errors.password = passwordError;

  if (!confirmPassword)
    errors.confirmPassword = "Please confirm your password.";
  else if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (Object.keys(errors).length > 0) return { errors };

  try {
    await verifyModeratorInvite(request, {
      token,
      firstName,
      lastName,
      password,
    });
    const params = new URLSearchParams({
      notice: "moderator_invite_accepted",
    });
    return redirect(`/tk-admin/login?${params.toString()}`);
  } catch (error) {
    return {
      errors: {
        form: inviteErrorMessage(error),
        token:
          error instanceof ProtectedApiError &&
          (error.status === 400 || error.status === 404 || error.status === 410)
            ? "Invalid or expired invite link."
            : undefined,
      },
    };
  }
}
