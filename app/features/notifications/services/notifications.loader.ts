import type { Route } from "project-types/notifications/route/+types/notifications";
import { getNotifications } from "~/routes/api/notifications/notifications.server";

function readPositiveInteger(value: string | null, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.floor(parsed);
}

const ZERO_UNREAD_COUNTS = {
  forum: 0,
  profile_view: 0,
  new_message: 0,
  achievement: 0,
  event_reminder: 0,
  application: 0,
  launchpad_update: 0,
  points: 0,
  system: 0,
};

export async function notificationsLoader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = readPositiveInteger(url.searchParams.get("page"), 1);
  const limit = readPositiveInteger(url.searchParams.get("limit"), 20);
  const unreadOnly = url.searchParams.get("unreadOnly") === "true";
  const type = url.searchParams.get("type");
  const archived = url.searchParams.get("archived") === "true";

  try {
    const result = await getNotifications(
      request,
      page,
      limit,
      unreadOnly || undefined,
      type || undefined,
      archived || undefined,
    );

    const unreadCount = Object.values(result.unreadCounts).reduce(
      (sum, n) => sum + n,
      0,
    );

    return Response.json({ ...result, unreadCount });
  } catch (err) {
    console.error("[notifications] loader error:", err);
    return Response.json(
      {
        ok: false,
        error: "Failed to fetch notifications",
        notifications: [],
        total: 0,
        page: 1,
        limit: 20,
        unreadCount: 0,
        unreadCounts: ZERO_UNREAD_COUNTS,
      },
      { status: 500 },
    );
  }
}
