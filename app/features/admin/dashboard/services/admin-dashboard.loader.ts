import type { Route } from "project-types/admin/dashboard/route/+types/admin-dashboard";
import { redirect } from "react-router";
import { withAuthData } from "~/lib/server/auth-response.server";
import {
  getAdminDashboardActiveUsers,
  getAdminDashboardNewRegistrations,
  getAdminDashboardOverview,
} from "~/api/admin/dashboard/dashboard.server";
import { requireAdmin } from "~/lib/server/route-guards.server";
import {
  DEFAULT_ACTIVE_USERS_PERIOD,
  DEFAULT_NEW_REGISTRATIONS_PERIOD,
  DEFAULT_SUMMARY_PERIOD,
  type ActiveUsersData,
  type ChartPeriod,
  type DashboardOverview,
  type NewRegistrationsData,
} from "../types";

export async function adminDashboardLoader({ request }: Route.LoaderArgs) {
  const auth = await requireAdmin(request);
  const { accessToken } = auth;
  if (!accessToken) {
    throw redirect("/tk-admin/login");
  }

  // Server-render everything on first paint. The top date filter drives the
  // KPI tiles (summary period); each chart starts on its own default period and
  // refetches independently once mounted.
  const [
    overviewResult,
    summaryActiveUsersResult,
    summaryNewRegistrationsResult,
    chartActiveUsersResult,
    chartNewRegistrationsResult,
  ] = await Promise.all([
    getAdminDashboardOverview(request, accessToken),
    getAdminDashboardActiveUsers(request, accessToken, DEFAULT_SUMMARY_PERIOD),
    getAdminDashboardNewRegistrations(
      request,
      accessToken,
      DEFAULT_SUMMARY_PERIOD,
    ),
    getAdminDashboardActiveUsers(
      request,
      accessToken,
      DEFAULT_ACTIVE_USERS_PERIOD,
    ),
    getAdminDashboardNewRegistrations(
      request,
      accessToken,
      DEFAULT_NEW_REGISTRATIONS_PERIOD,
    ),
  ]);

  const isSuperAdmin = auth.admin.role === "SUPER_ADMIN";
  const overview: DashboardOverview = isSuperAdmin
    ? overviewResult.dashboard
    : {
        ...overviewResult.dashboard,
        summary: {
          ...overviewResult.dashboard.summary,
          totalUsers: 0,
          totalPartners: null,
        },
      };

  return withAuthData(auth, {
    overview,
    summary: {
      period: DEFAULT_SUMMARY_PERIOD,
      activeUsers: summaryActiveUsersResult.activeUsers,
      newRegistrations: summaryNewRegistrationsResult.newRegistrations,
    },
    charts: {
      activeUsers: chartActiveUsersResult.activeUsers,
      newRegistrations: chartNewRegistrationsResult.newRegistrations,
    },
  } satisfies {
    overview: DashboardOverview;
    summary: {
      period: ChartPeriod;
      activeUsers: ActiveUsersData;
      newRegistrations: NewRegistrationsData;
    };
    charts: {
      activeUsers: ActiveUsersData;
      newRegistrations: NewRegistrationsData;
    };
  });
}
