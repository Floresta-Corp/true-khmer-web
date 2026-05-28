import { CheckCircle2, EllipsisVertical } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "../../../components/ui/card";
import { motion } from "motion/react";
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
  onLoadMore?: () => void;
  isLoading?: boolean;
  isInitialLoading?: boolean;
  hasMore?: boolean;
}

function NotificationSkeletonRow() {
  return (
    <div className="relative flex gap-5 items-center p-5 border-b border-gray-100 last:border-b-0">
      <Skeleton className="shrink-0 w-12 h-12 rounded-3xl" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-1/3 rounded" />
          <Skeleton className="h-4 w-1/4 rounded ml-auto" />
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
  onLoadMore,
  isLoading = false,
  isInitialLoading = false,
  hasMore = false,
}: NotificationsListProps) {
  return (
    <>
      <Card className="w-full bg-white rounded-3xl shadow-none overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between h-18 border-b border-gray-100 px-5 py-px">
          <h2 className="text-base font-semibold text-gray-900">
            All notifications
            {totalCount > 0 && (
              <span className="ml-2 text-gray-400 font-medium">
                ({totalCount})
              </span>
            )}
          </h2>
          <div className="flex gap-2.5 items-center">
            {unreadCount > 0 && (
              <Button
                variant={"default"}
                onClick={onMarkAllRead}
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 h-8.5  text-white rounded-2xl px-5 py-2 text-xs font-semibold"
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
                className={`group relative flex gap-4 items-start p-5 border-b border-gray-100 last:border-b-0 ${
                  !notif.isRead ? "bg-blue-50/50" : ""
                }`}
              >
                {/* Icon */}
                <div
                  className={`flex items-center justify-center shrink-0 w-12 h-12 rounded-full ${notif.iconBgColor} ${notif.iconColor}`}
                >
                  {notif.icon}
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0 pr-4">
                  {/* Title + Category */}
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="truncate text-[15px] font-semibold text-gray-900 leading-snug">
                      {notif.title}
                    </h3>
                    {notif.category && (
                      <span className="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 text-[11px] font-semibold">
                        {notif.category}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="truncate text-sm font-normal text-gray-500 leading-normal">
                    {notif.description}
                  </p>
                </div>

                <div className="shrink-0 flex flex-col items-end justify-between h-12 min-w-17.5">
                  {/*  Unread Dot or Dropdown Menu on Hover */}
                  <div className="flex items-center justify-end gap-1 h-5 min-w-full">
                    {/* Unread dot */}
                    {!notif.isRead && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="size-2.5 rounded-full bg-blue-600 shrink-0 mx-1"
                      />
                    )}
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
                              className="flex items-center justify-center rounded-full cursor-pointer text-black hover:bg-gray-100 hover:text-gray-600 transition-colors"
                            >
                              <EllipsisVertical className="h-4.5 w-4.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 p-1">
                            <DropdownMenuItem
                              className="cursor-pointer text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded"
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
                  <span className="text-xs font-normal text-gray-500 whitespace-nowrap">
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
            className="border border-gray-300 bg-white text-gray-900 rounded-lg px-6 py-2.5 font-medium text-sm"
          >
            {isLoading ? "Loading..." : "Load older notifications"}
          </Button>
        </div>
      )}
    </>
  );
}
