import { z } from "zod";

export const fcmPlatformEnum = z.enum(["web", "android", "ios"]);
export type FcmTokenPlatform = z.infer<typeof fcmPlatformEnum>;

export const notificationTypeEnum = z.enum([
  "forum",
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
  profile_view: "User",
  new_message: "MessageSquare",
  achievement: "Trophy",
  event_reminder: "Clock",
  application: "Briefcase",
  launchpad_update: "Zap",
  points: "Star",
  system: "Bell",
};

export const NOTIFICATION_EVENT_ICON_MAP: Record<
  string,
  NotificationIconName
> = {
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
  return notification.webRoute ?? notification.data?.webRoute;
}
