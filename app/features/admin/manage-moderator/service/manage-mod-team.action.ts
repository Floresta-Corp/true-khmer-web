import { data, redirect } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import {
  postManageTeam,
  removeModerator,
} from "~/services/api/admin/manage-mod-team/manage-moderator.server";
import { getAdminAccessToken } from "~/lib/server/session.server";

const inviteSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  role: z.string().min(1, "Role is required"),
});

export async function manageModTeamAction({ request }: ActionFunctionArgs) {
  const { accessToken, setCookie } = await getAdminAccessToken(request);

  if (!accessToken) {
    throw redirect("/tk-admin/login");
  }

  const formData = await request.formData();
  const actionType = String(formData.get("intent") ?? "").trim();

  const allowedActionTypes = new Set(["invite", "remove"]);

  if (actionType && !allowedActionTypes.has(actionType)) {
    return data({ ok: false, message: "Unknown action intent" }, { status: 400 });
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
      });

      return data(
        { ok: true, message: null },
        setCookie ? { headers: { "Set-Cookie": setCookie } } : {},
      );
    } catch (err) {
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
      return data(
        { ok: false, message: "Failed to remove moderator." },
        { status: 400 },
      );
    }
  }

  return data({ ok: false, message: "Unknown action intent" }, { status: 400 });
}
