import { data, redirect } from "react-router";
import { z } from "zod";
import type { Route } from "project-types/admin/account-settings/route/+types/account-settings";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { updateAdminProfile } from "~/api/admin/auth/admin-account-settings.server";
import { invalidateAdminMeCache } from "~/api/admin/auth/admin-auth.server";
import { adminUploadPresign } from "~/api/admin/auth/admin-upload-presign.server";
import { requireAdmin } from "~/lib/server/route-guards.server";

const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/^\S+$/, "Password must not contain spaces"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function accountSettingsAction({ request }: Route.ActionArgs) {
  const { accessToken, setCookie } = await requireAdmin(request);

  if (!accessToken) {
    throw redirect("/tk-admin/login");
  }

  const cookieHeader = setCookie
    ? { headers: { "Set-Cookie": setCookie } }
    : {};

  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "").trim();

  if (intent === "update-profile") {
    const result = updateProfileSchema.safeParse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
    });

    if (!result.success) {
      return data(
        { ok: false, intent, message: result.error.issues[0].message },
        { status: 400, headers: cookieHeader.headers },
      );
    }

    let avatarKey: string | null = null;
    const avatarFile = formData.get("avatarFile") as File | null;

    if (avatarFile && avatarFile.size > 0) {
      try {
        const presign = await adminUploadPresign(request, accessToken, {
          contentType: avatarFile.type,
          fileSize: avatarFile.size,
        });

        if (!presign.ok) {
          return data(
            { ok: false, intent, message: "Failed to prepare avatar upload." },
            { status: 500, headers: cookieHeader.headers },
          );
        }

        const {
          uploadUrl,
          method,
          requiredHeaders,
          avatarKey: key,
        } = presign.upload;

        const uploadResult = await fetch(uploadUrl, {
          method,
          body: avatarFile,
          headers: requiredHeaders,
          signal: AbortSignal.timeout(30_000),
        });

        if (!uploadResult.ok) {
          return data(
            { ok: false, intent, message: "Failed to upload avatar image." },
            { status: 500, headers: cookieHeader.headers },
          );
        }

        avatarKey = key;
      } catch {
        return data(
          { ok: false, intent, message: "Failed to upload avatar image." },
          { status: 500, headers: cookieHeader.headers },
        );
      }
    }

    try {
      await updateAdminProfile(request, accessToken, {
        ...result.data,
        ...(avatarKey !== null ? { avatarKey } : {}),
      });
      await invalidateAdminMeCache(accessToken);
      return data(
        { ok: true, intent, message: "Profile updated successfully." },
        { headers: cookieHeader.headers },
      );
    } catch (err) {
      if (err instanceof ProtectedApiError) {
        return data(
          { ok: false, intent, message: err.message },
          { status: err.status, headers: cookieHeader.headers },
        );
      }
      return data(
        { ok: false, intent, message: "Failed to update profile." },
        { status: 500, headers: cookieHeader.headers },
      );
    }
  }

  if (intent === "change-password") {
    const result = changePasswordSchema.safeParse({
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (!result.success) {
      return data(
        { ok: false, intent, message: result.error.issues[0].message },
        { status: 400, headers: cookieHeader.headers },
      );
    }

    try {
      await updateAdminProfile(request, accessToken, {
        oldPassword: result.data.currentPassword,
        newPassword: result.data.newPassword,
      });
      return data(
        { ok: true, intent, message: "Password changed successfully." },
        { headers: cookieHeader.headers },
      );
    } catch (err) {
      if (err instanceof ProtectedApiError) {
        return data(
          { ok: false, intent, message: err.message },
          { status: err.status, headers: cookieHeader.headers },
        );
      }
      return data(
        { ok: false, intent, message: "Failed to change password." },
        { status: 500, headers: cookieHeader.headers },
      );
    }
  }

  return data(
    { ok: false, intent: "", message: "Unknown action." },
    { status: 400, headers: cookieHeader.headers },
  );
}
