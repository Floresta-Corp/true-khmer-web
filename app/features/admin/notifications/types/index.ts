import { z } from "zod";

export const adminNotificationTypeEnum = z.enum(["content_report", "system"]);
export type AdminNotificationType = z.infer<typeof adminNotificationTypeEnum>;

export const adminNotificationIconNameEnum = z.enum([
  "Flag",
  "ShieldAlert",
  "Bell",
]);
export type AdminNotificationIconName = z.infer<
  typeof adminNotificationIconNameEnum
>;

export const ADMIN_NOTIFICATION_ICON_MAP: Record<
  AdminNotificationType,
  AdminNotificationIconName
> = {
  content_report: "Flag",
  system: "Bell",
};

export interface AdminNotification {
  id: string;
  title: string;
  body: string;
  icon?: string | null;
  type: string;
  eventType?: string | null;
  dedupeKey?: string | null;
  aggregateCount?: number;
  data: Record<string, string> | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt?: string;
  webRoute?: string | null;
}

export interface AdminNotificationsResult {
  ok: boolean;
  notifications: AdminNotification[];
  total: number;
  page: number;
  limit: number;
  unreadCount: number;
}

export function resolveAdminNotificationIcon(
  type: string | undefined,
): AdminNotificationIconName {
  return (
    ADMIN_NOTIFICATION_ICON_MAP[type as AdminNotificationType] ??
    ADMIN_NOTIFICATION_ICON_MAP.system
  );
}

export function getAdminNotificationRoute(
  notification: AdminNotification,
): string | undefined {
  // Follow the backend-provided deep link, matching the user-facing
  // notifications feature (getNotificationRoute). The content-moderator route
  // does not read an `id`/`reportId` query param, so a hardcoded link there is
  // a dead click — only surface a "View" target when the backend gives us one.
  return notification.webRoute ?? notification.data?.webRoute ?? undefined;
}
