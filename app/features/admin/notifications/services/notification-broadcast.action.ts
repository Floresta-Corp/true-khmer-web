import { data, redirect } from "react-router";
import type { Route } from "project-types/admin/notifications/route/+types/notification-broadcast";
import { z } from "zod";
import { broadcastNotification } from "~/api/admin/notifications/notification-broadcast.server";
import { getAdminAccessToken } from "~/lib/server/session.server";
import { requireSuperAdmin } from "~/lib/server/route-guards.server";

const emptyToUndefined = (v: unknown) => (v === "" ? undefined : v);

const broadcastSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  type: z
    .enum([
      "system",
      "forum",
      "profile_view",
      "new_message",
      "achievement",
      "event_reminder",
      "application",
      "launchpad_update",
      "points",
    ])
    .default("system"),
  imageUrl: z.preprocess(emptyToUndefined, z.string().optional()),
  webRoute: z.preprocess(emptyToUndefined, z.string().optional()),
  mobileRoute: z.preprocess(emptyToUndefined, z.string().optional()),
});

export async function notificationBroadcastAction({
  request,
}: Route.ActionArgs) {
  const auth = await requireSuperAdmin(
    request,
    "Broadcasting notifications is restricted to Super Admins.",
  );
  const { accessToken, setCookie } = auth;
  if (!accessToken) {
    throw redirect("/tk-admin/login");
  }

  const formData = await request.formData();
  const result = broadcastSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    const message = result.error.issues.map((i) => i.message).join(", ");
    return data({ ok: false, error: message }, { status: 400 });
  }

  try {
    await broadcastNotification(request, accessToken, result.data);
    return data(
      { ok: true, error: null },
      setCookie ? { headers: { "Set-Cookie": setCookie } } : {},
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to send notification.";
    return data({ ok: false, error: message }, { status: 400 });
  }
}
