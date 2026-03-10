export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatEventType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

export function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatEventDateTime(dateString: string): string {
  const date = new Date(dateString);
  const day = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
  });
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${day} • ${time}`;
}

/** Badge-style category colors (solid, for cards) */
export const CATEGORY_COLORS: Record<string, string> = {
  NETWORKING: "bg-blue-600 text-white",
  WORKSHOP: "bg-purple-600 text-white",
  CULTURAL: "bg-orange-500 text-white",
  CONCERT: "bg-pink-600 text-white",
  EXHIBITION: "bg-teal-600 text-white",
  CONFERENCE: "bg-indigo-600 text-white",
  FESTIVAL: "bg-amber-500 text-white",
  SEMINAR: "bg-blue-600 text-white",
};

/** Lighter category colors (for detail page badge) */
export const CATEGORY_COLORS_LIGHT: Record<string, string> = {
  NETWORKING: "bg-blue-100 text-blue-700",
  WORKSHOP: "bg-purple-100 text-purple-700",
  CULTURAL: "bg-orange-100 text-orange-700",
  CONCERT: "bg-pink-100 text-pink-700",
  EXHIBITION: "bg-teal-100 text-teal-700",
  CONFERENCE: "bg-indigo-100 text-indigo-700",
  FESTIVAL: "bg-amber-100 text-amber-700",
  SEMINAR: "bg-blue-100 text-blue-700",
};
