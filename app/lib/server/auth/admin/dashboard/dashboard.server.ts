import { apiRequestWithAccessToken } from "~/lib/server/api-client.server";
import type { AdminDashboardResponse } from "~/types/api-client";

export async function getAdminDashboard(
  request: Request,
  accessToken: string,
) {
  const result = await apiRequestWithAccessToken<AdminDashboardResponse>(
    request,
    accessToken,
    "/admin/dashboard",
    { method: "GET" },
  );

  return result;
}
