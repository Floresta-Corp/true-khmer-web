import { useEffect, useState } from "react";
import { useLoaderData, useFetcher } from "react-router";
import { loader } from "~/features/notifications/routes/notifications";
import { formatDistanceToNow } from "date-fns";
import NotificationsList, {
  type NotificationItem,
} from "~/features/notifications/components/notifications-list";
import { useIsMobile } from "~/hooks/use-mobile";
import NotificationFilterSidebar from "../notification-filter-sidebar";
import { TooltipProvider } from "~/components/ui/tooltip";
import { NOTIFICATION_ICON_MAP } from "~/context/notification-context";
import {
  Bell,
  MessageSquare,
  Trophy,
  Clock,
  Briefcase,
  Zap,
  Star,
  User,
} from "lucide-react";

interface NotificationsData {
  ok: boolean;
  notifications: ApiNotification[];
  total: number;
  page: number;
  limit: number;
  unreadCount: number; // computed from sum of unreadCounts on server
}

interface ApiNotification {
  id: string;
  title: string;
  body: string;
  imageUrl: string | null;
  icon: string;
  type: string;
  data: Record<string, string> | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

type NotificationIconName =
  | "User"
  | "MessageSquare"
  | "Trophy"
  | "Clock"
  | "Briefcase"
  | "Zap"
  | "Star"
  | "Bell";

const NOTIFICATION_ICON_STYLE_MAP: Record<
  NotificationIconName,
  { bg: string; fg: string }
> = {
  User: { bg: "bg-[#D5EDFF]", fg: "text-[#2F6FE4]" },
  MessageSquare: { bg: "bg-[#D5EDFF]", fg: "text-[#2F6FE4]" },
  Trophy: { bg: "bg-[#D5EDFF]", fg: "text-[#2F6FE4]" },
  Clock: { bg: "bg-[#FFDB430D]", fg: "text-[#FFB366]" },
  Briefcase: { bg: "bg-[#F0FDF4]", fg: "text-[#1FC16B]" },
  Zap: { bg: "bg-[#D5EDFF]", fg: "text-[#2F6FE4]" },
  Star: { bg: "bg-amber-50", fg: "text-amber-500" },
  Bell: { bg: "bg-gray-100", fg: "text-gray-600" },
};

// Helper function to get icon component from icon name
const getIconComponent = (iconName: string): React.ReactNode => {
  switch (iconName) {
    case "User":
      return <User className="h-5 w-5" />;
    case "MessageSquare":
      return <MessageSquare className="h-5 w-5" />;
    case "Trophy":
      return <Trophy className="h-5 w-5" />;
    case "Clock":
      return <Clock className="h-5 w-5" />;
    case "Briefcase":
      return <Briefcase className="h-5 w-5" />;
    case "Zap":
      return <Zap className="h-5 w-5" />;
    case "Star":
      return <Star className="h-5 w-5" />;
    case "Bell":
      return <Bell className="h-5 w-5" />;
    default:
      return <User className="h-5 w-5" />;
  }
};

function toItem(notif: ApiNotification): NotificationItem {
  // Use icon field from API response directly
  const iconName = notif.icon || "User"; // fallback to User icon if no icon specified
  const mappedIconName =
    (Object.values(NOTIFICATION_ICON_MAP).find((name) => name === iconName) as
      | NotificationIconName
      | undefined) ?? "User";
  const iconStyle = NOTIFICATION_ICON_STYLE_MAP[mappedIconName];

  return {
    id: notif.id,
    title: notif.title,
    description: notif.body,
    category: notif.data?.category,
    timeAgo: formatDistanceToNow(new Date(notif.createdAt), {
      addSuffix: true,
    }),
    isRead: notif.isRead,
    icon: getIconComponent(mappedIconName),
    iconBgColor: iconStyle.bg,
    iconColor: iconStyle.fg,
  };
}

export default function NotificationPage() {
  const loaderData = useLoaderData<typeof loader>();
  const isMobile = useIsMobile();
  const fetcher = useFetcher();

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
    // Optimistic update
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        notifications: prev.notifications.map((n) => ({
          ...n,
          isRead: n.id === id ? true : n.isRead,
          readAt: n.id === id ? new Date().toISOString() : n.readAt,
        })),
        unreadCount: prev.unreadCount > 0 ? prev.unreadCount - 1 : 0,
      };
    });

    fetcher.submit(
      { notificationIds: [id] },
      {
        method: "POST",
        action: "/api/notifications/read",
        encType: "application/json",
      },
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-[calc(100vh-4rem)] w-full bg-blue-gray-50 px-28 py-10">
        <div className="flex gap-7 items-start w-full">
          {!isMobile && (
            <NotificationFilterSidebar unreadCount={data?.unreadCount ?? 0} />
          )}
          <div className="flex-1 flex flex-col">
            <NotificationsList
              notifications={(data?.notifications ?? []).map(toItem)}
              unreadCount={data?.unreadCount ?? 0}
              totalCount={data?.total ?? 0}
              onMarkAllRead={handleMarkAllRead}
              onMarkRead={handleMarkRead}
              isInitialLoading={!data}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
