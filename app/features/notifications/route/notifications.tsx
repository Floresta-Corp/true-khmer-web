import { notificationsLoader } from "../services/notifications.loader";
import NotificationPage from "../components/pages/notification-page";

export const loader = notificationsLoader;

export function meta() {
  return [{ title: "Notifications | True Khmer" }];
}

export default function NotificationsPage() {
  return <NotificationPage />;
}
