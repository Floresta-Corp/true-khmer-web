import { redirect } from "react-router";
import type { Route } from "project-types/admin/notifications/route/+types/admin-notifications";
import { getAdminNotifications } from "~/api/admin/notifications/admin-notifications.server";
import { requireAdmin } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { adminNotificationTypeEnum } from "../types";

const DEFAULT_LIMIT = 20;

function readPositiveInteger(value: string | null, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.floor(parsed);
}

export async function adminNotificationsLoader({ request }: Route.LoaderArgs) {
  const auth = await requireAdmin(request);
  const { accessToken } = auth;
  if (!accessToken) {
    throw redirect("/tk-admin/login");
  }

  const url = new URL(request.url);
  const page = readPositiveInteger(url.searchParams.get("page"), 1);
  const limit = readPositiveInteger(
    url.searchParams.get("limit"),
    DEFAULT_LIMIT,
  );
  const unreadOnly = url.searchParams.get("unreadOnly") === "true";
  const parsedType = adminNotificationTypeEnum.safeParse(
    url.searchParams.get("type"),
  );
  const type = parsedType.success ? parsedType.data : undefined;

  const result = await getAdminNotifications(
    request,
    accessToken,
    page,
    limit,
    unreadOnly || undefined,
    type,
  );

  const totalPages = Math.max(Math.ceil(result.total / limit), 1);

  return withAuthData(auth, {
    ...result,
    page,
    limit,
    totalPages,
    unreadOnly,
    type: type ?? null,
  });
}
