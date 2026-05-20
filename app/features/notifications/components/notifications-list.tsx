import { CheckCircle2, Settings } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "../../../components/ui/card";
import { motion } from "motion/react";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  category?: string;
  timeAgo: string;
  isRead: boolean;
  icon: React.ReactNode;
  iconBgColor: string;
}

interface NotificationsListProps {
  notifications: NotificationItem[];
  onMarkAllRead?: () => void;
  onLoadMore?: () => void;
  isLoading?: boolean;
}

export default function NotificationsList({
  notifications,
  onMarkAllRead,
  onLoadMore,
  isLoading = false,
}: NotificationsListProps) {
  return (
    <>
      <Card className="w-full bg-white rounded-3xl shadow-none overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between h-18 border-b border-gray-100 px-5 py-px">
          <h2 className="text-base font-semibold text-gray-900">
            All notifications
            <span className="ml-2 text-gray-400 font-medium">(6)</span>
          </h2>
          <div className="flex gap-2.5 items-center">
            <Button
              onClick={onMarkAllRead}
              className="bg-blue-600 h-8.5 hover:bg-primary-dark text-white rounded-2xl px-5 py-2 text-xs font-semibold gap-2 shadow-lg"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Mark all as read
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border border-gray-200 bg-white rounded-2xl px-4 py-3 h-8.5"
            >
              <Settings className="h-3.5 w-3.5 text-gray-700" />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex flex-col">
          {notifications.map((notif, index) => (
            <div
              key={notif.id}
              className={`relative flex gap-5 items-center p-5 border-b border-gray-100 last:border-b-0 ${
                !notif.isRead ? "bg-blue-50" : ""
              }`}
            >
              {/* Icon */}
              <div
                className={`flex items-center justify-center shrink-0 rounded-3.5 w-12 h-12 ${notif.iconBgColor}`}
              >
                {notif.icon}
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-start gap-3">
                  <h3 className="text-base font-semibold text-gray-900">
                    {notif.title}
                  </h3>
                  {notif.category && (
                    <span className="inline-flex items-center px-1.75 py-0.5 rounded-2 bg-gray-100 text-gray-700 text-xs font-semibold">
                      {notif.category}
                    </span>
                  )}
                  <span className="ml-auto text-xs font-semibold text-gray-500 whitespace-nowrap">
                    {notif.timeAgo}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {notif.description}
                </p>
              </div>

              {/* Unread indicator */}
              {!notif.isRead && (
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-center shrink-0 right-0 absolute top-1/2 transform -translate-y-1/2"
                >
                  <div className="w-1 h-10.5 rounded-tl-full rounded-bl-full bg-blue-600" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </Card>
      {/* Load More */}
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
    </>
  );
}
