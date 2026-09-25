import { z } from "zod";
import { resolveLegacyManagePostRoute } from "~/lib/redirects";

export const notificationTypeEnum = z.enum([
  "forum",
  "blog",
  "profile_view",
  "new_message",
  "achievement",
  "event_reminder",
  "application",
  "launchpad_update",
  "points",
  "system",
]);
export type NotificationType = z.infer<typeof notificationTypeEnum>;

export const notificationIconNameEnum = z.enum([
  "MessageCircle",
  "Newspaper",
  "ThumbsUp",
  "User",
  "MessageSquare",
  "Trophy",
  "Clock",
  "Briefcase",
  "Zap",
  "Star",
  "Bell",
]);
export type NotificationIconName = z.infer<typeof notificationIconNameEnum>;

export const NOTIFICATION_ICON_MAP: Record<
  NotificationType,
  NotificationIconName
> = {
  forum: "MessageCircle",
  blog: "Newspaper",
  profile_view: "User",
  new_message: "MessageSquare",
  achievement: "Trophy",
  event_reminder: "Clock",
  application: "Briefcase",
  launchpad_update: "Zap",
  points: "Star",
  system: "Bell",
};

export const NOTIFICATION_EVENT_ICON_MAP: Record<string, NotificationIconName> =
  {
    forum_answer_created: "MessageCircle",
    forum_answer_reply_created: "MessageCircle",
    forum_question_upvoted: "ThumbsUp",
    forum_answer_upvoted: "ThumbsUp",
  };

export interface ApiNotification {
  id: string;
  title: string;
  body: string;
  imageUrl: string | null;
  icon?: string | null;
  type: string;
  eventType?: string | null;
  webRoute?: string | null;
  data: Record<string, string> | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResult {
  ok: boolean;
  notifications: ApiNotification[];
  total: number;
  page: number;
  limit: number;
  unreadCounts: Record<NotificationType, number>;
}

export function resolveNotificationIcon(
  type: string | undefined,
  eventType: string | null | undefined,
): NotificationIconName {
  return (
    (eventType ? NOTIFICATION_EVENT_ICON_MAP[eventType] : undefined) ??
    NOTIFICATION_ICON_MAP[type as NotificationType] ??
    NOTIFICATION_ICON_MAP.system
  );
}

export function getNotificationEventType(notification: ApiNotification) {
  return notification.eventType ?? notification.data?.eventType;
}

export function getNotificationRoute(notification: ApiNotification) {
  const webRoute = notification.webRoute ?? notification.data?.webRoute;
  if (!webRoute) return webRoute;

  const raw = webRoute.trim();
  if (!raw) return undefined;

  if (/^[a-z][a-z\d+\-.]*:/i.test(raw) || raw.startsWith("//"))
    return undefined;

  const path = raw.startsWith("/") ? raw : `/${raw}`;
  const [pathname, rest = ""] = splitPathname(path);

  return `${resolveLegacyManagePostRoute(pathname) ?? pathname}${rest}`;
}

function splitPathname(path: string): [string, string] {
  const index = path.search(/[?#]/);
  return index === -1 ? [path, ""] : [path.slice(0, index), path.slice(index)];
}
