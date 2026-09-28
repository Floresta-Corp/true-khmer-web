import type { ShouldRevalidateFunctionArgs } from "react-router";
import { notificationsLoader } from "../services/notifications.loader";
import NotificationPage from "../components/pages/notification-page";

export const loader = notificationsLoader;

// Mark-read submissions are applied optimistically on the page. Revalidating
// would reset the list to page 1 and drop pages loaded by infinite scroll.
export function shouldRevalidate({
  formAction,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  if (formAction?.startsWith("/api/notifications/read")) return false;
  return defaultShouldRevalidate;
}

export function meta() {
  return [{ title: "Notifications | True Khmer" }];
}

export default function NotificationsPage() {
  return <NotificationPage />;
}
