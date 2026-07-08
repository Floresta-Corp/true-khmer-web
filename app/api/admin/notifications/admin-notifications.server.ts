import { apiRequestWithAccessToken } from "~/lib/server/api-client.server";
import type { AdminNotificationsResult } from "~/features/admin/notifications/types";

export type AdminMarkAsReadResult = {
  ok: boolean;
  message?: string;
};

export async function getAdminNotifications(
  request: Request,
  accessToken: string,
  page: number,
  limit: number,
  unreadOnly?: boolean,
  type?: string,
): Promise<AdminNotificationsResult> {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("limit", String(limit));
  if (unreadOnly !== undefined) params.append("unreadOnly", String(unreadOnly));
  if (type !== undefined) params.append("type", type);

  return apiRequestWithAccessToken<AdminNotificationsResult>(
    request,
    accessToken,
    `/admin/notifications?${params.toString()}`,
  );
}

export async function markAdminNotificationsRead(
  request: Request,
  accessToken: string,
  notificationIds: string[],
): Promise<AdminMarkAsReadResult> {
  return apiRequestWithAccessToken<AdminMarkAsReadResult>(
    request,
    accessToken,
    `/admin/notifications/read`,
    {
      method: "PATCH",
      body: { notificationIds },
    },
  );
}

export async function markAllAdminNotificationsRead(
  request: Request,
  accessToken: string,
  type?: string,
): Promise<AdminMarkAsReadResult> {
  const params = new URLSearchParams();
  if (type !== undefined) params.append("type", type);
  const query = params.toString();

  return apiRequestWithAccessToken<AdminMarkAsReadResult>(
    request,
    accessToken,
    `/admin/notifications/read/all${query ? `?${query}` : ""}`,
    {
      method: "PATCH",
    },
  );
}
