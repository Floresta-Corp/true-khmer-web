import { data } from "react-router";
import { z } from "zod";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import {
  clearAndRedirectToLogin,
  requestWithSetCookie,
  requireUser,
} from "~/lib/server/route-guards.server";
import { invalidateAuthSessionCacheForRequest } from "~/services/auth/session.server";
import type { Route } from "project-types/settings/route/+types/settings.security";
import type { SettingsActionData } from "../types";
export type { SettingsActionData } from "../types";
import { changePassword, deleteAccount } from "~/api/auth/auth.server";
import { getPasswordValidationError } from "~/routes/auth/domain/password-validation";
import {
  appendCookie,
  firstFieldError,
  settingsActionError,
} from "./settings-action.server";

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

export async function settingsAction({ request }: Route.ActionArgs) {
  const auth = await requireUser(request);
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData);
  const intent = String(formValues.intent || "");
  const headers = new Headers();
  appendCookie(headers, auth.setCookie);

  try {
    if (intent === "delete-account") {
      if (formValues.confirm !== "CONFIRM") {
        return data<SettingsActionData>(
          { intent, errors: { form: "Enter CONFIRM to delete your account." } },
          { status: 400, headers },
        );
      }

      await deleteAccount(requestWithSetCookie(request, auth.setCookie));
      await invalidateAuthSessionCacheForRequest(request);
      return clearAndRedirectToLogin(request, "/");
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

    return settingsActionError(request, error, intent, headers);
  }
}
