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

const ADMIN_NOTIFICATION_DEFAULT_ROUTE: Partial<
  Record<AdminNotificationType, string>
> = {
  content_report: "/tk-admin/content-moderator",
};

export function getAdminNotificationRoute(
  notification: AdminNotification,
): string | undefined {
  // For content reports, always land on the moderation table — the backend's
  // webRoute for this type currently points at the reported content itself
  // (e.g. the forum thread/answer being reported), which is where the *user*
  // notification for that content would go, not where a moderator should
  // land. Other types still follow the backend-provided deep link, matching
  // the user-facing notifications feature (getNotificationRoute).
  const defaultRoute =
    ADMIN_NOTIFICATION_DEFAULT_ROUTE[
      notification.type as AdminNotificationType
    ];
  const route =
    defaultRoute ?? notification.webRoute ?? notification.data?.webRoute;
  if (!route) return undefined;

  const contentId = notification.data?.contentId;
  if (contentId) {
    const separator = route.includes("?") ? "&" : "?";
    return `${route}${separator}contentId=${encodeURIComponent(contentId)}`;
  }
  return route;
}
