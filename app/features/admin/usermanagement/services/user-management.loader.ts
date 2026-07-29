import { data, redirect } from "react-router";
import type { Route } from "project-types/admin/usermanagement/route/+types/user-management";

import { getAdminAccessToken } from "~/lib/server/session.server";
import { requireSuperAdmin } from "~/lib/server/route-guards.server";
import {
  getAdminUserManagement,
  getAdminUserManagementStats,
} from "~/api/admin/user-management/user-management.server";

function positiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export async function userManagementLoader({ request }: Route.LoaderArgs) {
  await requireSuperAdmin(
    request,
    "User management is restricted to Super Admins.",
  );
  const { accessToken, setCookie } = await getAdminAccessToken(request);

  if (!accessToken) {
    throw redirect("/tk-admin/login");
  }

  const url = new URL(request.url);
  const page = positiveInteger(url.searchParams.get("page"), 1);
  const limit = Math.min(
    positiveInteger(url.searchParams.get("limit"), 20),
    100,
  );

  const users = getAdminUserManagement(
    request,
    {
      page,
      limit,
      search: url.searchParams.get("search")?.trim() || undefined,
      status: url.searchParams.get("status") || undefined,
      tier: url.searchParams.get("tier") || undefined,
    },
    accessToken,
  ).then((result) => result.data);

  const stats = getAdminUserManagementStats(request, accessToken).then(
    (result) => result.data.stats,
  );

  return data(
    { users, stats },
    {
      ...(setCookie ? { headers: { "Set-Cookie": setCookie } } : {}),
    },
  );
}
