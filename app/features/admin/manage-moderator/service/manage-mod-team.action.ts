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

const roleSchema = z.enum(["MODERATOR", "SUPER_ADMIN"]);

const inviteSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  role: roleSchema,
});

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

  if (actionType === "remove") {
    const memberId = String(formData.get("memberId") ?? "").trim();

    if (!memberId) {
      return data(
        { ok: false, message: "Member ID is required." },
        { status: 400 },
      );
    }

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

  if (actionType === "update-role") {
    const memberId = String(formData.get("memberId") ?? "").trim();
    const role = String(formData.get("role") ?? "").trim();
    const currentRole = String(formData.get("currentRole") ?? "").trim();

    if (!memberId) {
      return data(
        { ok: false, message: "Member ID is required." },
        { status: 400 },
      );
    }

    const roleResult = roleSchema.safeParse(role);
    if (!roleResult.success) {
      return data(
        { ok: false, message: "Invalid role value." },
        { status: 400 },
      );
    }

    try {
      await patchModerator(request, memberId, accessToken, {
        role: roleResult.data,
      });

      return data(
        { ok: true, message: null },
        setCookie ? { headers: { "Set-Cookie": setCookie } } : {},
      );
    } catch (err) {
      if (err instanceof ProtectedApiError) {
        if (
          err.status === 404 &&
          currentRole === "SUPER_ADMIN" &&
          roleResult.data === "MODERATOR"
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
