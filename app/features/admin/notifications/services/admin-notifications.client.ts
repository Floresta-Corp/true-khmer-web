export interface AdminNotificationsFeed {
  notifications: unknown[];
  unreadCount: number;
}

export async function fetchAdminNotifications(
  query: string,
): Promise<AdminNotificationsFeed | null> {
  try {
    const res = await fetch(`/api/admin/notifications?${query}`);
    if (!res.ok) return null;
    return (await res.json()) as AdminNotificationsFeed;
  } catch {
    return null;
  }
}

function postJson(url: string, body?: unknown) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  }).catch(() => {
    // Ignore network errors; optimistic UI has already been applied.
  });
}

export function markAdminNotificationsReadRequest(notificationIds: string[]) {
  return postJson("/api/admin/notifications/read", { notificationIds });
}

export function markAllAdminNotificationsReadRequest(type?: string) {
  const query = type ? `?type=${encodeURIComponent(type)}` : "";
  return postJson(`/api/admin/notifications/read/all${query}`);
}
