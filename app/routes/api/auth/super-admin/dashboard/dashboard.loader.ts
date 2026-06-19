import type { Route } from "project-types/admin/dashboard/+types/admin-dashboard";
import { redirect } from "react-router";
import { withAuthData } from "~/lib/server/auth-response.server";
import { getAdminDashboard } from "~/lib/server/auth/admin/dashboard/dashboard.server";
import { requireSuperAdmin } from "~/lib/server/route-guards.server";
import { getAdminAccessToken } from "~/lib/server/session.server";
import type { AdminDashboardResponse } from "~/types/api-client";

export type AdminDashboardData = AdminDashboardResponse["dashboard"];

export async function adminDashboardLoader({ request }: Route.LoaderArgs) {
  const auth = await requireSuperAdmin(request);
  const { accessToken } = await getAdminAccessToken(request);
  if (!accessToken) {
    throw redirect("/tk-admin/login");
  }

  const result = await getAdminDashboard(request, accessToken);

  return withAuthData(auth, {
    dashboard: result.dashboard,
  } satisfies { dashboard: AdminDashboardData });
}
