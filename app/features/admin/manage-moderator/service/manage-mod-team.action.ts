import { data, redirect } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { postManageTeam } from "~/services/api/admin/manage-mod-team/manage-mod-team.server";
import { getAdminAccessToken } from "~/lib/server/session.server";

const inviteSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  role: z.string().min(1, "Role is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export async function manageModTeamAction({ request }: ActionFunctionArgs) {
  const { accessToken, setCookie } = await getAdminAccessToken(request);

  if (!accessToken) {
    throw redirect("/tk-admin/login");
  }

  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "invite": {
      const result = inviteSchema.safeParse(Object.fromEntries(formData));

      if (!result.success) {
        const message = result.error.issues.map((i) => i.message).join(", ");
        return data({ ok: false, error: message }, { status: 400 });
      }

      const payload = result.data;

      try {
        await postManageTeam(request, accessToken, {
          email: payload.email,
          name: payload.name,
          password: payload.password,
          role: payload.role,
        });

        return data(
          { ok: true, error: null },
          setCookie ? { headers: { "Set-Cookie": setCookie } } : {},
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to invite moderator.";
        return data({ ok: false, error: message }, { status: 400 });
      }
    }

    default:
      return data({ error: "Unknown action intent" }, { status: 400 });
  }
}
