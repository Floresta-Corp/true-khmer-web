import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Bell, Flag, ShieldAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { formatRelativeTime } from "~/lib/datetime";
import { useAdminNotifications } from "~/context/admin-notification-context";
import {
  getAdminNotificationRoute,
  resolveAdminNotificationIcon,
  type AdminNotification,
  type AdminNotificationIconName,
} from "~/features/admin/notifications/types";
import {
  fetchAdminNotifications,
  markAdminNotificationsReadRequest,
  markAllAdminNotificationsReadRequest,
} from "~/features/admin/notifications/services/admin-notifications.client";

const ADMIN_ICON_COMPONENT_MAP: Record<AdminNotificationIconName, LucideIcon> =
  {
    Flag,
    ShieldAlert,
    Bell,
  };

export function NotificationsDropdown() {
  const {
    unreadCount,
    setUnreadCount,
    recentNotifications,
    setRecentNotifications,
  } = useAdminNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [localNotifications, setLocalNotifications] =
    useState<AdminNotification[]>(recentNotifications);
  const [localUnreadCount, setLocalUnreadCount] = useState(unreadCount);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load notifications when the dropdown opens. Uses a plain fetch (not a
  // router fetcher) so it doesn't mutate router state and re-render the
  // surrounding admin layout / dashboard. See admin-notifications.client.ts.
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setLoading(true);
    fetchAdminNotifications("limit=5&page=1")
      .then((data) => {
        if (cancelled || !data) return;
        if (Array.isArray(data.notifications)) {
          const notifications = data.notifications as AdminNotification[];
          setLocalNotifications(notifications);
          setRecentNotifications(notifications);
        }
        if (typeof data.unreadCount === "number") {
          setLocalUnreadCount(data.unreadCount);
          setUnreadCount(data.unreadCount);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, setRecentNotifications, setUnreadCount]);

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

    markAllAdminNotificationsReadRequest();
  }

  function handleNotificationClick(notification: AdminNotification) {
    if (!notification.isRead) {
      const readAt = new Date().toISOString();
      const nextNotifications = localNotifications.map((item) =>
        item.id === notification.id ? { ...item, isRead: true, readAt } : item,
      );

      setLocalNotifications(nextNotifications);
      setRecentNotifications(nextNotifications);
      setLocalUnreadCount((count) => Math.max(count - 1, 0));
      setUnreadCount((count) => Math.max(count - 1, 0));

      markAdminNotificationsReadRequest([notification.id]);
    }

    const route = getAdminNotificationRoute(notification);
    if (route) {
      setIsOpen(false);
      navigate(route);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative rounded-xl p-2 transition-all md:p-2.5 ${
          isOpen
            ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
            : "text-slate-400 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-900/50 dark:hover:text-slate-100"
        }`}
        aria-label={
          localUnreadCount > 0
            ? `Notifications, ${localUnreadCount} unread`
            : "Open notifications"
        }
      >
        <Bell size={18} />
        {localUnreadCount > 0 && (
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full border border-slate-50 bg-rose-500 dark:border-[#020617]" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              className="absolute right-0 z-50 mt-3 flex w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_30px_60px_rgba(0,0,0,0.12)] sm:w-96 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-50 bg-white px-6 py-5 text-center sm:text-left dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-sm font-black tracking-tight text-slate-900 dark:text-white">
                  Notifications
                  {localUnreadCount > 0 && (
                    <span className="ml-2 text-[10px] font-black tracking-widest text-rose-500 uppercase">
                      {localUnreadCount} unread
                    </span>
                  )}
                </h3>
                {localUnreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="xs:inline hidden text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-slate-900 dark:hover:text-white"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-[80vh] overflow-auto py-2 sm:max-h-120">
                {loading && localNotifications.length === 0 ? (
                  <div className="flex items-center justify-center py-10 text-xs font-medium text-slate-400">
                    Loading…
                  </div>
                ) : localNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-10 text-xs font-medium text-slate-400">
                    <Bell size={22} className="opacity-30" />
                    <span>You&apos;re all caught up!</span>
                  </div>
                ) : (
                  localNotifications.map((notif) => {
                    const iconName = resolveAdminNotificationIcon(notif.type);
                    const Icon = ADMIN_ICON_COMPONENT_MAP[iconName];

                    return (
                      <button
                        type="button"
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className="group w-full cursor-pointer px-6 py-4 text-left transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <div className="flex gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                            <Icon size={18} />
                          </div>
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="flex items-center gap-1.5 truncate text-sm leading-none font-bold text-slate-900 dark:text-white">
                                {notif.title}
                                {!notif.isRead && (
                                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                                )}
                              </h4>
                              <span className="shrink-0 text-[10px] font-medium text-slate-400">
                                {formatRelativeTime(
                                  notif.updatedAt ?? notif.createdAt,
                                )}
                              </span>
                            </div>
                            <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                              {notif.body}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              <div className="border-t border-slate-50 dark:border-slate-800">
                <Link
                  to="/tk-admin/notifications"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center py-3.5 text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-slate-900 dark:hover:text-white"
                >
                  View all notifications
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
