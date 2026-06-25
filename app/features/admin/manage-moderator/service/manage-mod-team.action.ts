import { data, redirect } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import {
  patchModerator,
  postManageTeam,
  removeModerator,
} from "~/services/api/admin/manage-mod-team/manage-moderator.server";
import { getAdminAccessToken } from "~/lib/server/session.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";

// --- Validation Schemas ---

const roleSchema = z.enum(["MODERATOR", "SUPER_ADMIN"]);

const inviteSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  role: roleSchema,
});

const removeSchema = z.object({
  memberId: z.string().min(1, "Member ID is required."),
});

const updateRoleSchema = z.object({
  memberId: z.string().min(1, "Member ID is required."),
  role: roleSchema,
});

// --- Action Handler ---

export async function manageModTeamAction({ request }: ActionFunctionArgs) {
  const { accessToken, setCookie } = await getAdminAccessToken(request);

  if (!accessToken) {
    throw redirect("/tk-admin/login");
  }

  const formData = await request.formData();
  const actionType = String(formData.get("intent") ?? "").trim();

  const allowedActionTypes = new Set(["invite", "remove", "update-role"]);

  if (actionType && !allowedActionTypes.has(actionType)) {
    return data(
      { ok: false, message: "Unknown action intent" },
      { status: 400 },
    );
  }

  // 1. Invite Branch
  if (actionType === "invite") {
    const result = inviteSchema.safeParse({
      email: formData.get("email"),
      role: formData.get("role"),
    });

    if (!result.success) {
      const message = result.error.issues.map((i) => i.message).join(", ");
      return data({ ok: false, message }, { status: 400 });
    }

    const payload = result.data;
    try {
      await postManageTeam(request, accessToken, {
        email: payload.email,
        role: payload.role,
      });

      return data(
        { ok: true, message: null },
        setCookie ? { headers: { "Set-Cookie": setCookie } } : {},
      );
    } catch (err) {
      if (err instanceof ProtectedApiError) {
        return data(
          { ok: false, message: err.message },
          { status: err.status },
        );
      }

      return data(
        { ok: false, message: "Failed to invite moderator." },
        { status: 400 },
      );
    }
  }

  // 2. Remove Branch
  if (actionType === "remove") {
    const result = removeSchema.safeParse({
      memberId: formData.get("memberId"),
    });

    if (!result.success) {
      return data(
        { ok: false, message: result.error.issues[0].message },
        { status: 400 },
      );
    }

    const { memberId } = result.data;

    try {
      await removeModerator(request, memberId, accessToken);

      return data(
        { ok: true, message: null },
        setCookie ? { headers: { "Set-Cookie": setCookie } } : {},
      );
    } catch (err) {
      if (err instanceof ProtectedApiError) {
        return data(
          { ok: false, message: err.message },
          { status: err.status },
        );
      }

      return data(
        { ok: false, message: "Failed to remove moderator." },
        { status: 400 },
      );
    }
  }

  // 3. Update-Role Branch
  if (actionType === "update-role") {
    const result = updateRoleSchema.safeParse({
      memberId: formData.get("memberId"),
      role: formData.get("role"),
    });

    if (!result.success) {
      // Provide a clear fallback error message matching the old implementation if specific field issues aren't parsed
      const message = result.error.issues.some((i) => i.path.includes("role"))
        ? "Invalid role value."
        : result.error.issues[0].message;

      return data({ ok: false, message }, { status: 400 });
    }

    const { memberId, role } = result.data;
    const currentRole = String(formData.get("currentRole") ?? "").trim();

    try {
      await patchModerator(request, memberId, accessToken, { role });

      return data(
        { ok: true, message: null },
        setCookie ? { headers: { "Set-Cookie": setCookie } } : {},
      );
    } catch (err) {
      if (err instanceof ProtectedApiError) {
        if (
          err.status === 404 &&
          currentRole === "SUPER_ADMIN" &&
          role === "MODERATOR"
        ) {
          return data(
            {
              ok: false,
              message:
                "This super admin cannot be changed back to moderator from this endpoint. The backend is returning 'Moderator not found' for super-admin records.",
            },
            { status: err.status },
          );
        }

        return data(
          { ok: false, message: err.message },
          { status: err.status },
        );
      }

      return data(
        { ok: false, message: "Failed to update moderator role." },
        { status: 400 },
      );
    }
  }

  return data({ ok: false, message: "Unknown action intent" }, { status: 400 });
}
