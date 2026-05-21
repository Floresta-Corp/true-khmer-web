import { useSearchParams } from "react-router";
import { User, MessageSquare, Compass, Briefcase, Zap } from "lucide-react";
import NotificationsList, {
  type NotificationItem,
} from "~/features/notifications/components/notifications-list";
import { useIsMobile } from "~/hooks/use-mobile";
import NotificationFilterSidebar from "../notification-filter-sidebar";
import { TooltipProvider } from "~/components/ui/tooltip";

type NotificationType =
  | "profile_view"
  | "message"
  | "achievement"
  | "event"
  | "application"
  | "launchpad";

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: NotificationType;
  category?: string;
};

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Profile view",
    message:
      "Someone from Tech Cambodia viewed your public profile and checked your experience in Khmer Culture.",
    time: "2 mins ago",
    isRead: true,
    type: "profile_view",
  },
  {
    id: "2",
    title: "New message",
    message:
      "Your mentor Virak sent you a new resource: The future of agri-tech in rural Cambodia: Opportunities and challenges.",
    time: "2 mins ago",
    isRead: true,
    type: "message",
    category: "Mentorship",
  },
  {
    id: "3",
    title: "Achievement unlocked",
    message:
      "You've completed your first Khmer Heritage module! You've earned 50 impact points.",
    time: "5 hours ago",
    isRead: false,
    type: "achievement",
  },
  {
    id: "4",
    title: "Event reminder",
    message:
      "Your scheduled Eco Takeo project meeting is starting in 30 minutes.",
    time: "2 days ago",
    isRead: false,
    type: "event",
    category: "Events",
  },
  {
    id: "5",
    title: "Application accepted",
    message:
      "Congratulations! Your application for the 'Digital Krama' project has been accepted.",
    time: "3 days ago",
    isRead: false,
    type: "application",
    category: "Applications",
  },
  {
    id: "6",
    title: "Launchpad update",
    message:
      "New funding opportunities available for Agri-Tech startups in the Pursat region.",
    time: "3 days ago",
    isRead: false,
    type: "launchpad",
    category: "Launchpad",
  },
];

const getNotificationIcon = (type: NotificationType): React.ReactNode => {
  switch (type) {
    case "profile_view":
      return <User className="h-5 w-5 text-blue-600" />;
    case "message":
      return <MessageSquare className="h-5 w-5 text-blue-600" />;
    case "achievement":
      return <Compass className="h-5 w-5 text-gray-700" />;
    case "event":
      return <div className="h-5 w-5" />; // Placeholder for icon
    case "application":
      return <Briefcase className="h-5 w-5 text-green-600" />;
    case "launchpad":
      return <Zap className="h-5 w-5 text-blue-600" />;
    default:
      return null;
  }
};

const getNotificationIconBg = (type: NotificationType): string => {
  switch (type) {
    case "profile_view":
      return "bg-blue-100";
    case "message":
      return "bg-blue-100";
    case "achievement":
      return "bg-blue-100";
    case "event":
      return "bg-yellow-50";
    case "application":
      return "bg-green-50";
    case "launchpad":
      return "bg-blue-100";
    default:
      return "bg-gray-100";
  }
};

export default function NotificationPage() {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "all";

  const filteredNotifications = mockNotifications.filter((notification) => {
    if (filter === "unread") return !notification.isRead;
    if (filter === "read") return notification.isRead;
    return true;
  });

  // Convert to NotificationItem interface
  const notificationItems: NotificationItem[] = filteredNotifications.map(
    (notif) => ({
      id: notif.id,
      title: notif.title,
      description: notif.message,
      category: notif.category,
      timeAgo: notif.time,
      isRead: notif.isRead,
      icon: getNotificationIcon(notif.type),
      iconBgColor: getNotificationIconBg(notif.type),
    }),
  );

  const handleMarkAllRead = () => {
    // TODO: Implement mark all as read functionality
    console.log("Mark all as read");
  };

  const handleLoadMore = () => {
    // TODO: Implement load more functionality
    console.log("Load more notifications");
  };

  const isMobile = useIsMobile();

  return (
    <TooltipProvider>
      <div className="min-h-[calc(100vh-4rem)] w-full bg-blue-gray-50 px-28 py-10">
        <div className="flex gap-7 items-start w-full">
          {!isMobile && <NotificationFilterSidebar />}
          <div className="flex-1 flex flex-col">
            <NotificationsList
              notifications={notificationItems}
              onMarkAllRead={handleMarkAllRead}
              onLoadMore={handleLoadMore}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
