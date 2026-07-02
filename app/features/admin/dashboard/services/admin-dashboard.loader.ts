import type { Route } from "project-types/admin/dashboard/route/+types/admin-dashboard";
import { redirect } from "react-router";
import { withAuthData } from "~/lib/server/auth-response.server";
import { getAdminDashboard } from "~/api/admin/dashboard/dashboard.server";
import { requireAdmin } from "~/lib/server/route-guards.server";
import { getAdminAccessToken } from "~/lib/server/session.server";
import type { AdminDashboardData } from "../types";

export type { AdminDashboardData } from "../types";

export async function adminDashboardLoader({ request }: Route.LoaderArgs) {
  const auth = await requireAdmin(request);
  const { accessToken } = await getAdminAccessToken(request);
  if (!accessToken) {
    throw redirect("/tk-admin/login");
  }

  const result = await getAdminDashboard(request, accessToken);

  return withAuthData(auth, {
    dashboard: result.dashboard,
  } satisfies { dashboard: AdminDashboardData });
}
