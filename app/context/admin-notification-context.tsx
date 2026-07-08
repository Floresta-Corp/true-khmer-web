import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useNavigate } from "react-router";
import { Bell, Flag, ShieldAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { showNotificationToast } from "~/components/notification-toast";
import {
  getAdminNotificationRoute,
  resolveAdminNotificationIcon,
  type AdminNotificationIconName,
} from "~/features/admin/notifications/types";
import type { AdminNotification } from "~/features/admin/notifications/types";

const ADMIN_TOAST_ICON_MAP: Record<AdminNotificationIconName, LucideIcon> = {
  Flag,
  ShieldAlert,
  Bell,
};

// Accent gradient per notification type; content reports read as urgent,
// everything else uses the brand primary (#2F6FE4).
function adminToastAccent(type: string) {
  return type === "content_report"
    ? "from-rose-500 to-orange-500"
    : "from-[#2F6FE4] to-[#1E5AD0]";
}

export type { AdminNotification } from "~/features/admin/notifications/types";

interface AdminNotificationContextValue {
  unreadCount: number;
  setUnreadCount: Dispatch<SetStateAction<number>>;
  recentNotifications: AdminNotification[];
  setRecentNotifications: Dispatch<SetStateAction<AdminNotification[]>>;
}

const defaultValue: AdminNotificationContextValue = {
  unreadCount: 0,
  setUnreadCount: () => {},
  recentNotifications: [],
  setRecentNotifications: () => {},
};

const AdminNotificationContext =
  createContext<AdminNotificationContextValue>(defaultValue);

export function useAdminNotifications() {
  return useContext(AdminNotificationContext);
}

interface Props {
  children: ReactNode;
  /** Pass false to skip SSE entirely (e.g. unauthenticated) */
  enabled?: boolean;
}

export function AdminNotificationProvider({ children, enabled = true }: Props) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<
    AdminNotification[]
  >([]);
  const esRef = useRef<EventSource | null>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  // Fetch initial unread count
  useEffect(() => {
    if (!enabled) return;
    fetch("/api/admin/notifications?limit=1&page=1")
      .then((r) => r.json())
      .then((d) => {
        if (typeof d?.unreadCount === "number") setUnreadCount(d.unreadCount);
      })
      .catch(() => {});
  }, [enabled]);

  // Global SSE → toasts, always active for authenticated admins
  useEffect(() => {
    if (!enabled) return;

    function connect() {
      const es = new EventSource("/api/admin/notifications/stream");
      esRef.current = es;

      es.addEventListener("notification", (e) => {
        try {
          const notif = JSON.parse(e.data) as AdminNotification;
          const iconName = resolveAdminNotificationIcon(notif.type);
          const Icon = ADMIN_TOAST_ICON_MAP[iconName];
          const route = getAdminNotificationRoute(notif);
          showNotificationToast({
            icon: <Icon className="size-5" />,
            title: notif.title,
            body: notif.body,
            accentClassName: adminToastAccent(notif.type),
            onView: route ? () => navigate(route) : undefined,
          });
          setUnreadCount((c) => c + 1);
          setRecentNotifications((prev) => [notif, ...prev.slice(0, 9)]);
        } catch {
          // ignore parse errors
        }
      });

      es.addEventListener("ping", () => {});

      es.onerror = () => {
        es.close();
        retryRef.current = setTimeout(connect, 3_000);
      };
    }

    connect();

    return () => {
      if (retryRef.current) clearTimeout(retryRef.current);
      esRef.current?.close();
    };
  }, [enabled]);

  return (
    <AdminNotificationContext.Provider
      value={{
        unreadCount,
        setUnreadCount,
        recentNotifications,
        setRecentNotifications,
      }}
    >
      {children}
    </AdminNotificationContext.Provider>
  );
}
