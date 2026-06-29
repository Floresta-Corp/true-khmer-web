import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import {
  getNotifications,
  markNotificationsRead,
  markAllNotificationsRead,
} from "~/api/notifications/notifications.server";

function readPositiveInteger(
  value: string | null,
  fallback: number,
): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.floor(parsed);
}

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const page = readPositiveInteger(url.searchParams.get("page"), 1);
    const limit = readPositiveInteger(url.searchParams.get("limit"), 20);
    const unreadOnly = url.searchParams.get("unreadOnly") === "true";
    const type = url.searchParams.get("type");
    const archived = url.searchParams.get("archived") === "true";

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
    console.error("[api/notifications] loader", err);
    return Response.json(
      { ok: false, error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const body = (await request.json()) as {
      intent?: "markRead" | "markAllRead";
      notificationIds?: string[];
    };

    // Support both new intent-based format and legacy PATCH format
    const intent = body.intent;

    if (intent === "markAllRead") {
      const result = await markAllNotificationsRead(request);
      return Response.json(result);
    }

    if (body.notificationIds?.length) {
      const result = await markNotificationsRead(request, body.notificationIds);
      return Response.json(result);
    }

    return Response.json(
      { ok: false, error: "Invalid request" },
      { status: 400 },
    );
  } catch (err) {
    console.error("[api/notifications] action", err);
    return Response.json(
      { ok: false, error: "Failed to mark as read" },
      { status: 500 },
    );
  }
}
