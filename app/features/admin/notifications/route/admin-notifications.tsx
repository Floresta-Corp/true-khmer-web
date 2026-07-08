import { useEffect, useMemo, useState } from "react";
import {
  useLoaderData,
  useNavigate,
  useNavigation,
  useSearchParams,
} from "react-router";
import { Bell, CheckCircle2, Flag, ShieldAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatRelativeTime } from "~/lib/datetime";
import { useAdminNotifications } from "~/context/admin-notification-context";
import {
  getAdminNotificationRoute,
  resolveAdminNotificationIcon,
  type AdminNotification,
  type AdminNotificationIconName,
} from "~/features/admin/notifications/types";
import { NotificationsPagination } from "../components/notifications-pagination";
import { NotificationsSkeleton } from "../components/notifications-skeleton";
import {
  markAdminNotificationsReadRequest,
  markAllAdminNotificationsReadRequest,
} from "../services/admin-notifications.client";
import { adminNotificationsLoader } from "../services/admin-notifications.loader";

export const loader = adminNotificationsLoader;

export function meta() {
  return [{ title: "Notifications | True Khmer Admin" }];
}

const ADMIN_ICON_COMPONENT_MAP: Record<AdminNotificationIconName, LucideIcon> =
  {
    Flag,
    ShieldAlert,
    Bell,
  };

const TYPE_FILTERS = [
  { label: "All", value: "" },
  { label: "Content reports", value: "content_report" },
  { label: "System", value: "system" },
] as const;

type LoaderData = {
  notifications: AdminNotification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  unreadCount: number;
  unreadOnly: boolean;
  type: string | null;
};

export default function AdminNotifications() {
  const loaderData = useLoaderData<
    typeof adminNotificationsLoader
  >() as LoaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const { setRecentNotifications, setUnreadCount } = useAdminNotifications();

  const [notifications, setNotifications] = useState<AdminNotification[]>(
    loaderData.notifications,
  );
  const [unreadCount, setLocalUnreadCount] = useState(loaderData.unreadCount);

  // Sync state when loader data changes (filter / page navigation)
  useEffect(() => {
    setNotifications(loaderData.notifications);
    setLocalUnreadCount(loaderData.unreadCount);
  }, [loaderData]);

  const activeType = searchParams.get("type") ?? "";
  const unreadOnly = searchParams.get("unreadOnly") === "true";
  const isLoading = navigation.state === "loading";

  const hasUnread = useMemo(
    () => notifications.some((n) => !n.isRead),
    [notifications],
  );

  function updateFilter(next: Record<string, string | null>) {
    setSearchParams((current) => {
      const params = new URLSearchParams(current);
      for (const [key, value] of Object.entries(next)) {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      }
      // Reset to first page whenever a filter changes
      params.delete("page");
      return params;
    });
  }

  function handleMarkAllRead() {
    if (!hasUnread) return;
    const readAt = new Date().toISOString();

    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true, readAt })),
    );
    setLocalUnreadCount(0);
    setRecentNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true, readAt })),
    );
    setUnreadCount(0);

    markAllAdminNotificationsReadRequest();
  }

  function handleMarkRead(id: string) {
    const target = notifications.find((n) => n.id === id);
    if (!target || target.isRead) return;
    const readAt = new Date().toISOString();

    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true, readAt } : n)),
    );
    setLocalUnreadCount((count) => Math.max(count - 1, 0));
    setRecentNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true, readAt } : n)),
    );
    setUnreadCount((count) => Math.max(count - 1, 0));

    markAdminNotificationsReadRequest([id]);
  }

  function handleNotificationClick(notif: AdminNotification) {
    if (!notif.isRead) handleMarkRead(notif.id);
    const route = getAdminNotificationRoute(notif);
    if (route) navigate(route);
  }

  return (
    <main className="min-h-full bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-10 lg:py-8 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-350">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-1">
          <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl dark:text-white">
            Notifications
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {loaderData.total.toLocaleString()} total
            {unreadCount > 0 && (
              <>
                {" · "}
                <span className="font-semibold text-rose-500">
                  {unreadCount} unread
                </span>
              </>
            )}
          </p>
        </header>

        <section className="flex min-h-[clamp(28rem,calc(100dvh-14rem),48rem)] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              {TYPE_FILTERS.map((filter) => {
                const active = activeType === filter.value;
                return (
                  <button
                    key={filter.value || "all"}
                    type="button"
                    onClick={() => updateFilter({ type: filter.value })}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide transition-all ${
                      active
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}

              <div className="mx-1 hidden h-5 w-px bg-slate-200 sm:block dark:bg-slate-700" />

              <button
                type="button"
                onClick={() =>
                  updateFilter({ unreadOnly: unreadOnly ? null : "true" })
                }
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide transition-all ${
                  unreadOnly
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                }`}
              >
                Unread only
              </button>
            </div>

            {hasUnread && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-1.5 self-start rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 sm:self-auto"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <NotificationsSkeleton />
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-400">
                <Bell className="h-9 w-9 opacity-30" />
                <span className="text-sm font-medium">
                  You&apos;re all caught up!
                </span>
              </div>
            ) : (
              notifications.map((notif) => {
                const iconName = resolveAdminNotificationIcon(notif.type);
                const Icon = ADMIN_ICON_COMPONENT_MAP[iconName];

                return (
                  <div
                    key={notif.id}
                    className={`group relative flex items-start gap-4 border-b border-slate-100 px-4 py-4 transition-colors last:border-b-0 sm:px-5 dark:border-slate-800 ${
                      notif.isRead
                        ? "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                        : "bg-blue-50/40 hover:bg-blue-50/70 dark:bg-blue-500/5 dark:hover:bg-blue-500/10"
                    }`}
                  >
                    {!notif.isRead && (
                      <span className="absolute top-1/2 left-0 h-9 w-1 -translate-y-1/2 rounded-r-full bg-blue-500" />
                    )}

                    <button
                      type="button"
                      onClick={() => handleNotificationClick(notif)}
                      className="flex min-w-0 flex-1 items-start gap-4 text-left"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                        <Icon size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                            {notif.title}
                          </h3>
                          {!notif.isRead && (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                          )}
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                          {notif.body}
                        </p>
                        <span className="mt-1 block text-[11px] font-medium text-slate-400">
                          {formatRelativeTime(
                            notif.updatedAt ?? notif.createdAt,
                          )}
                        </span>
                      </div>
                    </button>

                    {!notif.isRead && (
                      <button
                        type="button"
                        onClick={() => handleMarkRead(notif.id)}
                        aria-label={`Mark "${notif.title}" as read`}
                        title="Mark as read"
                        className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {!isLoading && notifications.length > 0 && (
            <NotificationsPagination
              page={loaderData.page}
              limit={loaderData.limit}
              totalPages={loaderData.totalPages}
              total={loaderData.total}
            />
          )}
        </section>
      </div>
    </main>
  );
}
