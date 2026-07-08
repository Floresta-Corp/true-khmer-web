import type { LoaderFunctionArgs } from "react-router";
import { getAdminNotifications } from "~/api/admin/notifications/admin-notifications.server";
import { getAdminAccessToken } from "~/lib/server/session.server";

function readPositiveInteger(value: string | null, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.floor(parsed);
}

export async function adminNotificationsFeedLoader({
  request,
}: LoaderFunctionArgs) {
  const { accessToken, setCookie } = await getAdminAccessToken(request);
  if (!accessToken) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const page = readPositiveInteger(url.searchParams.get("page"), 1);
    const limit = readPositiveInteger(url.searchParams.get("limit"), 20);
    const unreadOnly = url.searchParams.get("unreadOnly") === "true";
    const type = url.searchParams.get("type");

    const result = await getAdminNotifications(
      request,
      accessToken,
      page,
      limit,
      unreadOnly || undefined,
      type || undefined,
    );

    return Response.json(
      result,
      setCookie ? { headers: { "Set-Cookie": setCookie } } : {},
    );
  } catch (err) {
    console.error("[api/admin/notifications] loader", err);
    return Response.json(
      { ok: false, error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}
