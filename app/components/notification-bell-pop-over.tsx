import { useEffect, useState } from "react";
import { Link, useFetcher, useNavigate } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { useNotifications } from "~/context/notification-context";
import { Skeleton } from "~/components/ui/skeleton";
import { Bell, CheckCircle2 } from "lucide-react";
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

export default function NotificationBellPopOver() {
  const {
    unreadCount,
    setUnreadCount,
    recentNotifications,
    setRecentNotifications,
  } = useNotifications();

  const [open, setOpen] = useState(false);
  const [localNotifications, setLocalNotifications] =
    useState<ApiNotification[]>(recentNotifications);
  const [localUnreadCount, setLocalUnreadCount] = useState(unreadCount);
  const loadFetcher = useFetcher<{
    notifications: ApiNotification[];
    unreadCount: number;
  }>();
  const actionFetcher = useFetcher();
  const navigate = useNavigate();

  // Load notifications via server when popover opens
  useEffect(() => {
    if (!open) return;
    loadFetcher.load("/api/notifications?limit=5&page=1");
  }, [open]);

  // Sync fetched data into local + context state
  useEffect(() => {
    if (!loadFetcher.data) return;
    const { notifications, unreadCount: count } = loadFetcher.data;
    if (Array.isArray(notifications)) {
      setLocalNotifications(notifications);
      setRecentNotifications(notifications);
    }
    if (typeof count === "number") {
      setLocalUnreadCount(count);
      setUnreadCount(count);
    }
  }, [loadFetcher.data, setRecentNotifications, setUnreadCount]);

  // Keep local UI in sync with context updates such as SSE pushes.
  useEffect(() => {
    setLocalNotifications(recentNotifications);
    setLocalUnreadCount(unreadCount);
  }, [recentNotifications, unreadCount]);

  function handleMarkAllRead() {
    if (!localNotifications.some((n) => !n.isRead)) return;
    const readAt = new Date().toISOString();
    const nextNotifications = localNotifications.map((n) => ({
      ...n,
      isRead: true,
      readAt,
    }));

    // Optimistic update
    setLocalNotifications(nextNotifications);
    setRecentNotifications(nextNotifications);
    setLocalUnreadCount(0);
    setUnreadCount(0);

    actionFetcher.submit(
      {},
      {
        method: "POST",
        action: "/api/notifications/read/all",
        encType: "application/json",
      },
    );
  }

  function handleNotificationClick(notification: ApiNotification) {
    if (!notification.isRead) {
      const readAt = new Date().toISOString();
      const nextNotifications = localNotifications.map((item) =>
        item.id === notification.id ? { ...item, isRead: true, readAt } : item,
      );

      setLocalNotifications(nextNotifications);
      setRecentNotifications(nextNotifications);
      setLocalUnreadCount((count) => Math.max(count - 1, 0));
      setUnreadCount((count) => Math.max(count - 1, 0));

      actionFetcher.submit(
        { notificationIds: [notification.id] },
        {
          method: "POST",
          action: "/api/notifications/read",
          encType: "application/json",
        },
      );
    }

    const route = getNotificationRoute(notification);
    if (route) {
      setOpen(false);
      navigate(route);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-8.75 rounded-full border border-[#f1f5f9] bg-white text-[#344256] hover:bg-[#f8fafc] hover:text-[#0f172a]"
          aria-label={
            localUnreadCount > 0
              ? `Notifications, ${localUnreadCount} unread`
              : "Notifications"
          }
        >
          <Bell className="h-3.5 w-3.5" />
          {localUnreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 size-1.5 animate-ping rounded-full bg-[#fb2c36]" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 p-0 rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Notifications
            </h3>
            {localUnreadCount > 0 && (
              <p className="text-xs text-gray-400 font-medium">
                {localUnreadCount} UNREAD
              </p>
            )}
          </div>
          {localUnreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="cursor-pointer flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-500"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications */}
        <div className="flex flex-col max-h-96 overflow-y-auto">
          {loadFetcher.state === "loading" ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0"
              >
                <Skeleton className="shrink-0 w-9 h-9 rounded-xl" />
                <div className="flex-1 flex flex-col gap-1.5">
                  <Skeleton className="h-3 w-2/3 rounded" />
                  <Skeleton className="h-3 w-full rounded" />
                  <Skeleton className="h-2.5 w-1/3 rounded" />
                </div>
              </div>
            ))
          ) : localNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-sm text-gray-400">
              <CheckCircle2 className="h-7 w-7 opacity-30" />
              <span>You're all caught up!</span>
            </div>
          ) : (
            localNotifications.map((notif) => {
              const iconName = resolveNotificationIcon(
                notif.type,
                getNotificationEventType(notif),
              );
              const iconStyle = NOTIFICATION_ICON_STYLE_MAP[iconName];

              return (
                <button
                  type="button"
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={cn(
                    "flex w-full cursor-pointer items-start gap-3 border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-slate-50",
                    !notif.isRead && "",
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "flex items-center justify-center shrink-0 rounded-xl w-9 h-9 mt-0.5",
                      iconStyle.bg,
                      iconStyle.fg,
                    )}
                  >
                    <NotificationTypeIcon
                      iconName={iconName}
                      className="size-4"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-semibold text-gray-900 truncate">
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <span className="shrink-0 h-1.5 w-1.5 rounded-full bg-blue-600" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {notif.body}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(notif.updatedAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100">
          <Link
            to="/notifications"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center py-3 text-xs font-semibold text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
          >
            View all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
