import { z } from "zod";
import { data, redirect } from "react-router";
import type { Route } from "project-types/admin/manage-moderator/route/+types/manage-moderator";

import { getManageModTeam } from "~/api/admin/manage-moderator/manage-moderator.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { requireSuperAdmin } from "~/lib/server/route-guards.server";
import type { ManageModTeamLoaderData } from "../types";

export type { ManageModTeamLoaderData } from "../types";

const urlSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  role: z
    .enum(["moderator", "super_admin"])
    .optional()
    .transform(
      (v) => v?.toUpperCase() as "MODERATOR" | "SUPER_ADMIN" | undefined,
    ),
});

export async function manageModTeamLoader({ request }: Route.LoaderArgs) {
  const { admin, accessToken, setCookie } = await requireSuperAdmin(
    request,
    "Team management is restricted to Super Admins.",
  );

  const url = new URL(request.url);
  const { cursor, limit, search, role } = urlSchema.parse(
    Object.fromEntries(url.searchParams.entries()),
  );

  try {
    const { moderators, pagination } = await getManageModTeam(
      request,
      accessToken,
      { cursor, limit: limit.toString(), search, role },
    );

    return data<ManageModTeamLoaderData>(
      {
        moderators,
        pagination,
        currentUserId: admin?.id ?? "",
      },
      { ...(setCookie ? { headers: { "Set-Cookie": setCookie } } : {}) },
    );
  } catch (err) {
    if (err instanceof ProtectedApiError && err.status === 401) {
      throw redirect("/tk-admin/login");
    }
    throw err;
  }
}
