import type { ActionFunctionArgs } from "react-router";
import { markAllAdminNotificationsRead } from "~/api/admin/notifications/admin-notifications.server";
import { getAdminAccessToken } from "~/lib/server/session.server";

export async function adminNotificationsReadAllAction({
  request,
}: ActionFunctionArgs) {
  const { accessToken, setCookie } = await getAdminAccessToken(request);
  if (!accessToken) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const type = url.searchParams.get("type");

    const result = await markAllAdminNotificationsRead(
      request,
      accessToken,
      type || undefined,
    );
    return Response.json(
      result,
      setCookie ? { headers: { "Set-Cookie": setCookie } } : {},
    );
  } catch (err) {
    console.error("[api/admin/notifications/read/all] action", err);
    return Response.json(
      { ok: false, error: "Failed to mark all as read" },
      { status: 500 },
    );
  }
}
