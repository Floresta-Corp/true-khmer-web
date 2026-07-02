import type { Route } from "project-types/admin/dashboard/route/+types/admin-dashboard";
import { redirect } from "react-router";
import { withAuthData } from "~/lib/server/auth-response.server";
import { getAdminDashboard } from "~/api/admin/dashboard/dashboard.server";
import { requireAdmin } from "~/lib/server/route-guards.server";
import type { AdminDashboardData } from "../types";

export type { AdminDashboardData } from "../types";

export async function adminDashboardLoader({ request }: Route.LoaderArgs) {
  const auth = await requireAdmin(request);
  const { accessToken } = auth;
  if (!accessToken) {
    throw redirect("/tk-admin/login");
  }

  const result = await getAdminDashboard(request, accessToken);

  const isSuperAdmin = auth.admin.role === "SUPER_ADMIN";
  const dashboard: AdminDashboardData = isSuperAdmin
    ? result.dashboard
    : {
        ...result.dashboard,
        summary: {
          ...result.dashboard.summary,
          totalUsers: 0,
          totalPartners: null,
        },
      };

  return withAuthData(auth, {
    dashboard,
  } satisfies { dashboard: AdminDashboardData });
}
