import type { ActionFunctionArgs } from "react-router";
import { markNotificationsRead } from "~/routes/api/notifications/notifications.server";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const { notificationIds } = (await request.json()) as {
      notificationIds: string[];
    };

    if (
      !Array.isArray(notificationIds) ||
      notificationIds.length === 0 ||
      !notificationIds.every(
        (id) => typeof id === "string" && id.trim().length > 0,
      )
    ) {
      return Response.json(
        {
          ok: false,
          error: "notificationIds must be an array of non-empty strings",
        },
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
