import { useEffect, useState } from "react";
import { useFetcher, useLoaderData, useNavigate } from "react-router";
import { formatDistanceToNow } from "date-fns";
import NotificationsList, {
  type NotificationItem,
} from "~/features/notifications/components/notifications-list";
import NotificationFilterSidebar from "../notification-filter-sidebar";
import { TooltipProvider } from "~/components/ui/tooltip";
import { useNotifications } from "~/context/notification-context";
import {
  NOTIFICATION_ICON_STYLE_MAP,
  NotificationTypeIcon,
} from "~/components/notification-type-icon";
import {
  getNotificationEventType,
  getNotificationRoute,
  resolveNotificationIcon,
  type ApiNotification,
} from "~/features/notifications/types";
import type { loader } from "../../route/notifications";

interface NotificationsData {
  ok: boolean;
  notifications: ApiNotification[];
  total: number;
  page: number;
  limit: number;
  unreadCount: number; // computed from sum of unreadCounts on server
}

function toItem(notif: ApiNotification): NotificationItem {
  const iconName = resolveNotificationIcon(
    notif.type,
    getNotificationEventType(notif),
  );
  const iconStyle = NOTIFICATION_ICON_STYLE_MAP[iconName];

  return {
    id: notif.id,
    title: notif.title,
    description: notif.body,
    category: notif.data?.category,
    timeAgo: formatDistanceToNow(new Date(notif.updatedAt), {
      addSuffix: true,
    }),
    isRead: notif.isRead,
    webRoute: getNotificationRoute(notif),
    icon: <NotificationTypeIcon iconName={iconName} className="size-5" />,
    iconBgColor: iconStyle.bg,
    iconColor: iconStyle.fg,
  };
}

export default function NotificationPage() {
  const loaderData = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const { setRecentNotifications, setUnreadCount } = useNotifications();

  const [data, setData] = useState<NotificationsData | null>(
    loaderData as NotificationsData,
  );

  // Sync state when loader data changes (filter navigation)
  useEffect(() => {
    setData(loaderData as NotificationsData);
  }, [loaderData]);

  function handleMarkAllRead() {
    const unreadIds = (data?.notifications ?? [])
      .filter((n: ApiNotification) => !n.isRead)
      .map((n: ApiNotification) => n.id);
    if (!unreadIds.length) return;

    // Optimistic update
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        notifications: prev.notifications.map((n) => ({
          ...n,
          isRead: true,
          readAt: new Date().toISOString(),
        })),
        unreadCount: 0,
      };
    });
    setRecentNotifications((notifications) =>
      notifications.map((notification) => ({
        ...notification,
        isRead: true,
        readAt: new Date().toISOString(),
      })),
    );
    setUnreadCount(0);

    fetcher.submit(
      {},
      {
        method: "POST",
        action: "/api/notifications/read/all",
        encType: "application/json",
      },
    );
  }

  function handleMarkRead(id: string) {
    const wasUnread = data?.notifications.some(
      (notification) => notification.id === id && !notification.isRead,
    );

    // Optimistic update
    setData((prev) => {
      if (!prev) return prev;
      const wasUnread = prev.notifications.some(
        (n) => n.id === id && !n.isRead,
      );
      const readAt = new Date().toISOString();

      return {
        ...prev,
        notifications: prev.notifications.map((n) => ({
          ...n,
          isRead: n.id === id ? true : n.isRead,
          readAt: n.id === id ? readAt : n.readAt,
        })),
        unreadCount:
          wasUnread && prev.unreadCount > 0
            ? prev.unreadCount - 1
            : prev.unreadCount,
      };
    });
    if (wasUnread) {
      const readAt = new Date().toISOString();
      setRecentNotifications((notifications) =>
        notifications.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true, readAt }
            : notification,
        ),
      );
      setUnreadCount((count) => Math.max(count - 1, 0));
    }

    fetcher.submit(
      { notificationIds: [id] },
      {
        method: "POST",
        action: "/api/notifications/read",
        encType: "application/json",
      },
    );
  }

  function handleNotificationClick(notification: NotificationItem) {
    if (!notification.isRead) {
      handleMarkRead(notification.id);
    }

    if (notification.webRoute) {
      navigate(notification.webRoute);
    }
  }

  return (
    <TooltipProvider>
      <div className="bg-blue-gray-50 min-h-[calc(100dvh-4rem)] w-full px-4 pt-6 pb-24 sm:px-6 sm:py-10 md:px-10 md:pb-10 lg:px-16 xl:px-28">
        <div className="flex w-full flex-col items-start gap-4 md:flex-row md:gap-7">
          <NotificationFilterSidebar unreadCount={data?.unreadCount ?? 0} />
          <div className="flex w-full flex-1 flex-col">
            <NotificationsList
              notifications={(data?.notifications ?? []).map(toItem)}
              unreadCount={data?.unreadCount ?? 0}
              totalCount={data?.total ?? 0}
              onMarkAllRead={handleMarkAllRead}
              onMarkRead={handleMarkRead}
              onNotificationClick={handleNotificationClick}
              isInitialLoading={!data}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
