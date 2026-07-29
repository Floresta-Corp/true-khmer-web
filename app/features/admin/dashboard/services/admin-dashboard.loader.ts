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
  // refetches independently once mounted. The summary and chart defaults
  // usually coincide, so dedupe the periods rather than firing the same request
  // twice — still one round of parallel calls either way.
  const activeUsersPeriods = [
    ...new Set<ChartPeriod>([
      DEFAULT_SUMMARY_PERIOD,
      DEFAULT_ACTIVE_USERS_PERIOD,
    ]),
  ];
  const newRegistrationsPeriods = [
    ...new Set<ChartPeriod>([
      DEFAULT_SUMMARY_PERIOD,
      DEFAULT_NEW_REGISTRATIONS_PERIOD,
    ]),
  ];

  const [overviewResult, activeUsersByPeriod, newRegistrationsByPeriod] =
    await Promise.all([
      getAdminDashboardOverview(request, accessToken),
      Promise.all(
        activeUsersPeriods.map(async (period) => {
          const result = await getAdminDashboardActiveUsers(
            request,
            accessToken,
            period,
          );
          return [period, result.activeUsers] as const;
        }),
      ).then((entries) => new Map(entries)),
      Promise.all(
        newRegistrationsPeriods.map(async (period) => {
          const result = await getAdminDashboardNewRegistrations(
            request,
            accessToken,
            period,
          );
          return [period, result.newRegistrations] as const;
        }),
      ).then((entries) => new Map(entries)),
    ]);

  // Non-null: every period read below was just fetched into the map above.
  const activeUsersFor = (period: ChartPeriod) =>
    activeUsersByPeriod.get(period)!;
  const newRegistrationsFor = (period: ChartPeriod) =>
    newRegistrationsByPeriod.get(period)!;

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
      activeUsers: activeUsersFor(DEFAULT_SUMMARY_PERIOD),
      newRegistrations: newRegistrationsFor(DEFAULT_SUMMARY_PERIOD),
    },
    charts: {
      activeUsers: activeUsersFor(DEFAULT_ACTIVE_USERS_PERIOD),
      newRegistrations: newRegistrationsFor(DEFAULT_NEW_REGISTRATIONS_PERIOD),
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
