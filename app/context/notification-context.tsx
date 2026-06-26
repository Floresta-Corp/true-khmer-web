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
import { toast } from "sonner";
import type { ApiNotification } from "~/features/notifications/types";

export type { ApiNotification } from "~/features/notifications/types";

interface NotificationContextValue {
  unreadCount: number;
  setUnreadCount: Dispatch<SetStateAction<number>>;
  recentNotifications: ApiNotification[];
  setRecentNotifications: Dispatch<SetStateAction<ApiNotification[]>>;
}

const defaultValue: NotificationContextValue = {
  unreadCount: 0,
  setUnreadCount: () => {},
  recentNotifications: [],
  setRecentNotifications: () => {},
};

const NotificationContext =
  createContext<NotificationContextValue>(defaultValue);

export function useNotifications() {
  return useContext(NotificationContext);
}

interface Props {
  children: ReactNode;
  /** Pass false for unauthenticated users to skip SSE entirely */
  enabled?: boolean;
}

export function NotificationProvider({ children, enabled = true }: Props) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<
    ApiNotification[]
  >([]);
  const esRef = useRef<EventSource | null>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch initial unread count
  useEffect(() => {
    if (!enabled) return;
    fetch("/api/notifications?limit=1&page=1")
      .then((r) => r.json())
      .then((d) => {
        if (typeof d?.unreadCount === "number") setUnreadCount(d.unreadCount);
      })
      .catch(() => {});
  }, [enabled]);

  // Global SSE → toasts, always active for authenticated users
  useEffect(() => {
    if (!enabled) return;

    function connect() {
      const es = new EventSource("/api/notifications/stream");
      esRef.current = es;

      es.addEventListener("notification", (e) => {
        try {
          const notif = JSON.parse(e.data) as ApiNotification;
          toast(notif.title, { description: notif.body, duration: 5000 });
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
    <NotificationContext.Provider
      value={{
        unreadCount,
        setUnreadCount,
        recentNotifications,
        setRecentNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
