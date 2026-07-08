import type { ActionFunctionArgs } from "react-router";
import { markAdminNotificationsRead } from "~/api/admin/notifications/admin-notifications.server";
import { getAdminAccessToken } from "~/lib/server/session.server";

export async function adminNotificationsReadAction({
  request,
}: ActionFunctionArgs) {
  const { accessToken, setCookie } = await getAdminAccessToken(request);
  if (!accessToken) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

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

    const result = await markAdminNotificationsRead(
      request,
      accessToken,
      notificationIds,
    );
    return Response.json(
      result,
      setCookie ? { headers: { "Set-Cookie": setCookie } } : {},
    );
  } catch (err) {
    console.error("[api/admin/notifications/read] action", err);
    return Response.json(
      { ok: false, error: "Failed to mark as read" },
      { status: 500 },
    );
  }
}
