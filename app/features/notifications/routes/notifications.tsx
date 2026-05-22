import type { LoaderFunctionArgs } from "react-router";
import { getNotifications } from "~/services/notifications.server";
import NotificationPage from "../components/pages/notification-page";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? 1);
  const limit = Number(url.searchParams.get("limit") ?? 20);
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
        unreadCounts: {},
      },
      { status: 500 },
    );
  }
}

export function meta() {
  return [{ title: "Notifications | True Khmer" }];
}

export default function NotificationsPage() {
  return <NotificationPage />;
}
