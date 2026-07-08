import type { LoaderFunctionArgs } from "react-router";
import { resolveApiBase } from "~/lib/server/api-base.server";
import { getAdminAccessToken } from "~/lib/server/session.server";

export async function adminNotificationsStreamLoader({
  request,
}: LoaderFunctionArgs) {
  const { accessToken } = await getAdminAccessToken(request);
  if (!accessToken) return new Response("Unauthorized", { status: 401 });

  const base = resolveApiBase(request);

  let upstream: Response;
  try {
    upstream = await fetch(`${base}/admin/notifications/stream`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "text/event-stream",
        "Cache-Control": "no-cache",
      },
      // Do NOT pass request.signal — React Router aborts it on navigation
      // which would kill the upstream SSE connection and throw a 500.
    });
  } catch (err) {
    // Aborted or network error — return gracefully instead of 500
    if (request.signal.aborted) return new Response(null, { status: 204 });
    throw err;
  }

  if (!upstream.ok || !upstream.body)
    return new Response("Failed to connect to notification stream", {
      status: upstream.status,
    });

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
