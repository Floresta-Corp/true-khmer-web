import type { LoaderFunctionArgs } from "react-router";
import { getAdminDashboardActiveUsers } from "~/api/admin/dashboard/dashboard.server";
import { withAuthJson } from "~/lib/server/auth-response.server";
import { requireAdmin } from "~/lib/server/route-guards.server";
import { DEFAULT_ACTIVE_USERS_PERIOD, resolveChartPeriod } from "../types";

export async function loader({ request }: LoaderFunctionArgs) {
  const auth = await requireAdmin(request);
  const period = resolveChartPeriod(
    new URL(request.url).searchParams.get("period"),
    DEFAULT_ACTIVE_USERS_PERIOD,
  );

  try {
    const result = await getAdminDashboardActiveUsers(
      request,
      auth.accessToken,
      period,
    );
    return withAuthJson(auth, result);
  } catch (err) {
    console.error("[api/admin/dashboard/active-users] loader", err);
    return withAuthJson(
      auth,
      { ok: false, error: "Failed to load active users" },
      { status: 500 },
    );
  }
}
