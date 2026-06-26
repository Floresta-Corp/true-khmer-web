import { z } from "zod";

import { data, redirect, type ActionFunctionArgs } from "react-router";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { getPasswordValidationError } from "~/routes/auth/domain/password-validation";
import { verifyModeratorInvite } from "~/routes/api/manage-moderator/manage-moderator.server";

type AcceptInviteErrors = Partial<
  Record<"token" | "name" | "password" | "confirmPassword" | "form", string>
>;

export type AcceptInviteActionData = {
  errors?: AcceptInviteErrors;
};

const acceptInviteSchema = z
  .object({
    token: z.string().min(1, "Invitation token is required."),
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

function inviteErrorMessage(error: unknown) {
  if (error instanceof ProtectedApiError) {
    if (error.status === 400 || error.status === 404 || error.status === 410) {
      return "This invitation link is invalid or has expired. Please ask an admin to send a new invite.";
    }

    return "Unable to accept invitation. Please try again.";
  }

  return "Unable to accept invitation. Please try again.";
}

export async function acceptInviteAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const result = acceptInviteSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return data(
      {
        errors: {
          token: fieldErrors.token?.[0],
          name: fieldErrors.firstName?.[0] || fieldErrors.lastName?.[0],
          password: fieldErrors.password?.[0],
          confirmPassword: fieldErrors.confirmPassword?.[0],
        },
      },
      { status: 400 },
    );
  }

  const { token, firstName, lastName, password } = result.data;

  const passwordComplexityError = getPasswordValidationError(password);
  if (passwordComplexityError) {
    return data({ errors: { password: passwordComplexityError } }, { status: 400 });
  }

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
    return data(
      {
        errors: {
          form: inviteErrorMessage(error),
          token:
            error instanceof ProtectedApiError &&
            (error.status === 400 || error.status === 404 || error.status === 410)
              ? "Invalid or expired invite link."
              : undefined,
        },
      },
      { status: 400 },
    );
  }
}
