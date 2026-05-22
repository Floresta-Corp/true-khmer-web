import type { ActionFunctionArgs } from "react-router";
import { markNotificationsRead } from "~/services/notifications.server";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const { notificationIds } = (await request.json()) as {
      notificationIds: string[];
    };

    if (!notificationIds?.length) {
      return Response.json(
        { ok: false, error: "notificationIds is required" },
        { status: 400 },
      );
    }

    const result = await markNotificationsRead(request, notificationIds);
    return Response.json(result);
  } catch (err) {
    console.error("[api/notifications/read] action", err);
    return Response.json(
      { ok: false, error: "Failed to mark as read" },
      { status: 500 },
    );
  }
}
