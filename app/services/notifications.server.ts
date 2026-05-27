import { apiRequestWithSession } from "~/lib/server/api-client.server";

export type ApiNotification = {
  id: string;
  title: string;
  body: string;
  imageUrl: string | null;
  icon: string;
  type: string;
  data: Record<string, string> | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
};

export type NotificationsResult = {
  ok: boolean;
  notifications: ApiNotification[];
  total: number;
  page: number;
  limit: number;
  unreadCounts: {
    profile_view: number;
    new_message: number;
    achievement: number;
    event_reminder: number;
    application: number;
    launchpad_update: number;
    points: number;
    system: number;
  };
};

export type MarkAsReadResult = {
  ok: boolean;
};

export async function getNotifications(
  request: Request,
  page: number,
  limit: number,
  unreadOnly?: boolean,
  type?: string,
  archived?: boolean,
): Promise<NotificationsResult> {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("limit", String(limit));
  if (unreadOnly !== undefined) params.append("unreadOnly", String(unreadOnly));
  if (type !== undefined) params.append("type", type);
  if (archived !== undefined) params.append("archived", String(archived));

  const result = await apiRequestWithSession<NotificationsResult>(
    request,
    `/notifications?${params.toString()}`,
  );

  return result.data;
}

export async function markNotificationsRead(
  request: Request,
  notificationIds: string[],
): Promise<MarkAsReadResult> {
  const result = await apiRequestWithSession<MarkAsReadResult>(
    request,
    `/notifications/read`,
    {
      method: "PATCH",
      body: { notificationIds },
    },
  );

  return result.data;
}

export async function markAllNotificationsRead(
  request: Request,
): Promise<MarkAsReadResult> {
  const result = await apiRequestWithSession<MarkAsReadResult>(
    request,
    `/notifications/read/all`,
    {
      method: "PATCH",
    },
  );

  return result.data;
}
