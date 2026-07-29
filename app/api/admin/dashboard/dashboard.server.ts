import { apiRequestWithAccessToken } from "~/lib/server/api-client.server";
import type {
  AdminDashboardActiveUsersResponse,
  AdminDashboardNewRegistrationsResponse,
  ChartPeriod,
  DashboardOverviewResponse,
} from "~/features/admin/dashboard/types";

export async function getAdminDashboardOverview(
  request: Request,
  accessToken: string,
) {
  return apiRequestWithAccessToken<DashboardOverviewResponse>(
    request,
    accessToken,
    "/admin/dashboard",
    { method: "GET" },
  );
}

export async function getAdminDashboardActiveUsers(
  request: Request,
  accessToken: string,
  period: ChartPeriod,
) {
  return apiRequestWithAccessToken<AdminDashboardActiveUsersResponse>(
    request,
    accessToken,
    `/admin/dashboard/active-users?period=${period}`,
    { method: "GET" },
  );
}

export async function getAdminDashboardNewRegistrations(
  request: Request,
  accessToken: string,
  period: ChartPeriod,
) {
  return apiRequestWithAccessToken<AdminDashboardNewRegistrationsResponse>(
    request,
    accessToken,
    `/admin/dashboard/new-registrations?period=${period}`,
    { method: "GET" },
  );
}
