import { CheckCircle2, EllipsisVertical } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "../../../components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  category?: string;
  timeAgo: string;
  isRead: boolean;
  webRoute?: string | null;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
}

interface NotificationsListProps {
  notifications: NotificationItem[];
  unreadCount?: number;
  totalCount?: number;
  onMarkAllRead?: () => void;
  onMarkRead?: (id: string) => void;
  onNotificationClick?: (notification: NotificationItem) => void;
  onLoadMore?: () => void;
  isLoading?: boolean;
  isInitialLoading?: boolean;
  hasMore?: boolean;
}

function NotificationSkeletonRow() {
  return (
    <div className="relative flex items-center gap-5 border-b border-gray-100 p-5 last:border-b-0">
      <Skeleton className="h-12 w-12 shrink-0 rounded-3xl" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-1/3 rounded" />
          <Skeleton className="ml-auto h-4 w-1/4 rounded" />
        </div>
        <Skeleton className="h-3.5 w-full rounded" />
        <Skeleton className="h-3.5 w-3/4 rounded" />
      </div>
    </div>
  );
}

export default function NotificationsList({
  notifications,
  unreadCount = 0,
  totalCount = 0,
  onMarkAllRead,
  onMarkRead,
  onNotificationClick,
  onLoadMore,
  isLoading = false,
  isInitialLoading = false,
  hasMore = false,
}: NotificationsListProps) {
  return (
    <>
      <Card className="w-full overflow-hidden rounded-3xl bg-white shadow-none">
        {/* Header */}
        <div className="flex min-h-18 flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-4 py-3 sm:px-5 sm:py-px">
          <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
            All notifications
            {totalCount > 0 && (
              <span className="ml-2 font-medium text-gray-400">
                ({totalCount})
              </span>
            )}
          </h2>
          <div className="flex items-center gap-2.5">
            {unreadCount > 0 && (
              <Button
                variant={"default"}
                onClick={onMarkAllRead}
                className="h-8.5 cursor-pointer rounded-2xl bg-blue-600 px-3 py-2 text-xs font-semibold whitespace-nowrap text-white hover:bg-blue-700 sm:px-5"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Mark all as read
              </Button>
            )}
            {/* <Button
              variant="outline"
              size="sm"
              className="border border-gray-200 bg-white rounded-2xl px-4 py-3 h-8.5"
            >
              <Settings className="h-3.5 w-3.5 text-gray-700" />
            </Button> */}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex flex-col">
          {isInitialLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <NotificationSkeletonRow key={i} />
            ))
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-sm text-gray-400">
              <CheckCircle2 className="h-8 w-8 opacity-30" />
              <span>You're all caught up!</span>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`group relative flex items-start gap-3 border-b border-gray-100 p-3 last:border-b-0 sm:gap-4 sm:p-5 ${
                  !notif.isRead ? "bg-blue-50/50" : ""
                }`}
              >
                {!notif.isRead && (
                  <span className="absolute top-1/2 right-0 h-10 w-1 -translate-y-1/2 rounded-xl bg-blue-500" />
                )}
                <button
                  type="button"
                  onClick={() => onNotificationClick?.(notif)}
                  className="flex min-w-0 flex-1 cursor-pointer items-start gap-3 text-left sm:gap-4"
                >
                  {/* Icon */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12 ${notif.iconBgColor} ${notif.iconColor}`}
                  >
                    {notif.icon}
                  </div>

                  {/* Content Area */}
                  <div className="min-w-0 flex-1 pr-2 sm:pr-4">
                    {/* Title + Category */}
                    <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <h3 className="truncate text-sm leading-snug font-semibold text-gray-900 sm:text-[15px]">
                        {notif.title}
                      </h3>
                      {notif.category && (
                        <span className="inline-flex shrink-0 items-center rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-semibold text-gray-700">
                          {notif.category}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="truncate text-xs leading-normal font-normal text-gray-500 sm:text-sm">
                      {notif.description}
                    </p>
                  </div>
                </button>

                <div className="flex h-12 min-w-14 shrink-0 flex-col items-end justify-between sm:min-w-17.5">
                  {/*  Unread Dot or Dropdown Menu on Hover */}
                  <div className="flex h-5 min-w-full items-center justify-end gap-1">
                    {/* Dropdown Menu */}
                    {!notif.isRead && onMarkRead && (
                      <div className="flex items-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              type="button"
                              aria-label={`Open actions for "${notif.title}"`}
                              title="Notification read actions"
                              className="flex cursor-pointer items-center justify-center rounded-full text-black transition-colors hover:bg-gray-100 hover:text-gray-600"
                            >
                              <EllipsisVertical className="h-4.5 w-4.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 p-1">
                            <DropdownMenuItem
                              className="cursor-pointer rounded text-sm font-semibold text-gray-700 hover:bg-gray-100"
                              onClick={() => onMarkRead(notif.id)}
                            >
                              <CheckCircle2 className="h-4 w-4 text-blue-500" />
                              Mark as read
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>

                  {/* Time Stamp */}
                  <span className="text-[10px] font-normal whitespace-nowrap text-gray-400">
                    {notif.timeAgo}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Load More */}
      {hasMore && (
        <div className="flex items-center justify-center py-5">
          <Button
            onClick={onLoadMore}
            disabled={isLoading}
            variant="outline"
            className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-900"
          >
            {isLoading ? "Loading..." : "Load older notifications"}
          </Button>
        </div>
      )}
    </>
  );
}
