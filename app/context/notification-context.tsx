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
import { useNavigate, type NavigateFunction } from "react-router";
import {
  createNotificationToastGroup,
  summarizeLines,
  type NotificationToastOptions,
} from "~/components/notification-toast";
import {
  NOTIFICATION_ICON_ACCENT_MAP,
  NotificationTypeIcon,
} from "~/components/notification-type-icon";
import {
  getNotificationEventType,
  getNotificationRoute,
  resolveNotificationIcon,
} from "~/features/notifications/types";
import type {
  ApiNotification,
  NotificationIconName,
} from "~/features/notifications/types";

export type { ApiNotification } from "~/features/notifications/types";

function isAchievement(notif: ApiNotification) {
  return notif.type === "points" || notif.type === "achievement";
}

function toastIcon(iconName: NotificationIconName) {
  return <NotificationTypeIcon iconName={iconName} className="size-5" />;
}

// One notification keeps its own card; a burst becomes one card that totals
// the points and lists everything else.
function summarizeNotifications(
  items: ApiNotification[],
  navigate: NavigateFunction,
): NotificationToastOptions {
  if (items.length === 1) {
    const [notif] = items;
    const iconName = resolveNotificationIcon(
      notif.type,
      getNotificationEventType(notif),
    );
    const route = getNotificationRoute(notif);
    return {
      icon: toastIcon(iconName),
      title: notif.title,
      body: notif.body,
      imageUrl: notif.imageUrl,
      accentClassName: NOTIFICATION_ICON_ACCENT_MAP[iconName],
      onView: route ? () => navigate(route) : undefined,
    };
  }

  const pointsItems = items.filter((notif) => notif.type === "points");
  const others = items.filter((notif) => notif.type !== "points");
  const points = pointsItems.reduce(
    (sum, notif) => sum + (Number(notif.data?.points) || 0),
    0,
  );
  const lines = summarizeLines(others.map((notif) => notif.body));
  if (points > 0) lines.unshift(`+${points} points`);

  const iconName: NotificationIconName = items.every(isAchievement)
    ? others.length === 0
      ? "Star"
      : "Trophy"
    : "Bell";
  const title =
    others.length === 0 && points > 0
      ? `You earned ${points} points`
      : `${items.length} new notifications`;
  const routes = new Set(items.map(getNotificationRoute));
  const [sharedRoute] = routes;
  const route =
    routes.size === 1 && sharedRoute ? sharedRoute : "/notifications";

  return {
    icon: toastIcon(iconName),
    title,
    body:
      others.length === 0
        ? `From ${pointsItems.length} activities`
        : lines.join(" · "),
    accentClassName: NOTIFICATION_ICON_ACCENT_MAP[iconName],
    onView: () => navigate(route),
    actionLabel: route === "/notifications" ? "View all" : "View",
  };
}

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
  const attemptRef = useRef(0);
  const seenRef = useRef<Set<string>>(new Set());
  const navigate = useNavigate();

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

    const pushToast = createNotificationToastGroup<ApiNotification>((items) =>
      summarizeNotifications(items, navigate),
    );

    function connect() {
      const es = new EventSource("/api/notifications/stream");
      esRef.current = es;

      es.addEventListener("notification", (e) => {
        try {
          const notif = JSON.parse(e.data) as ApiNotification;
          // Ignore events the server replays after a reconnect so we don't
          // double-toast or over-count the unread badge.
          if (seenRef.current.has(notif.id)) return;
          seenRef.current.add(notif.id);
          pushToast(notif, { isAchievement: isAchievement(notif) });
          setUnreadCount((c) => c + 1);
          setRecentNotifications((prev) => [notif, ...prev.slice(0, 9)]);
        } catch {
          // ignore parse errors
        }
      });

      es.addEventListener("ping", () => {});

      es.onopen = () => {
        attemptRef.current = 0;
      };

      es.onerror = () => {
        es.close();
        // Exponential backoff (3s → 6s → … capped at 30s) so a persistently
        // failing stream (e.g. expired auth) doesn't hammer the endpoint.
        const delay = Math.min(30_000, 3_000 * 2 ** attemptRef.current);
        attemptRef.current += 1;
        retryRef.current = setTimeout(connect, delay);
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
