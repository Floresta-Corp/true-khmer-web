import { apiRequestWithAccessToken } from "~/lib/server/api-client.server";
import type { postV1notificationsbroadcast_Body } from "~/types/api-client";

export async function broadcastNotification(
  request: Request,
  accessToken: string,
  body: postV1notificationsbroadcast_Body,
) {
  return apiRequestWithAccessToken(
    request,
    accessToken,
    "/notifications/broadcast",
    { method: "POST", body },
  );
}
