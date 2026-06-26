import type { ActionFunctionArgs } from "react-router";
import { markAllNotificationsRead } from "~/routes/api/notifications/notifications.server";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const result = await markAllNotificationsRead(request);
    return Response.json(result);
  } catch (err) {
    console.error("[api/notifications/read/all] action", err);
    return Response.json(
      { ok: false, error: "Failed to mark all as read" },
      { status: 500 },
    );
  }
}
