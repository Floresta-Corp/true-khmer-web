export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateMonthYear(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid time";
  }
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatEventType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatEventDateTime(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid date/time";
  }
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
  CONFERENCE: "bg-indigo-600 text-white",
  WORKSHOP: "bg-purple-600 text-white",
  SEMINAR: "bg-blue-600 text-white",
  CONCERT: "bg-pink-600 text-white",
  FESTIVAL: "bg-amber-500 text-white",
  EXHIBITION: "bg-teal-600 text-white",
  NETWORKING: "bg-blue-600 text-white",
  TRAINING: "bg-green-600 text-white",
  WEBINAR: "bg-cyan-600 text-white",
  OTHER: "bg-gray-600 text-white",
  CULTURAL: "bg-orange-500 text-white",
};

/** Lighter category colors (for detail page badge) */
export const CATEGORY_COLORS_LIGHT: Record<string, string> = {
  CONFERENCE: "bg-indigo-100 text-indigo-700",
  WORKSHOP: "bg-purple-100 text-purple-700",
  SEMINAR: "bg-blue-100 text-blue-700",
  CONCERT: "bg-pink-100 text-pink-700",
  FESTIVAL: "bg-amber-100 text-amber-700",
  EXHIBITION: "bg-teal-100 text-teal-700",
  NETWORKING: "bg-blue-100 text-blue-700",
  TRAINING: "bg-green-100 text-green-700",
  WEBINAR: "bg-cyan-100 text-cyan-700",
  OTHER: "bg-gray-100 text-gray-700",
  CULTURAL: "bg-orange-100 text-orange-700",
};

/**
 * "Thu, Sep 3" — the date line on the event listing card.
 */
export function formatEventDayLabel(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatClockTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * "6:00 – 8:00 PM" when both ends share a meridiem, otherwise
 * "9:00 AM – 5:00 PM". Matches the time label in the design.
 */
export function formatEventTimeRange(
  startAt: string,
  endAt?: string | null,
): string {
  const start = new Date(startAt);
  if (isNaN(start.getTime())) {
    return "";
  }

  const startLabel = formatClockTime(start);
  const end = endAt ? new Date(endAt) : null;
  if (!end || isNaN(end.getTime())) {
    return startLabel;
  }

  const endLabel = formatClockTime(end);
  const sharesMeridiem = startLabel.slice(-2) === endLabel.slice(-2);

  return `${sharesMeridiem ? startLabel.slice(0, -3) : startLabel} – ${endLabel}`;
}

/**
 * Cover placeholder colour per event type, drawn from the design system ramps
 * the design uses for its event categories. It sits behind the cover photo, so
 * it only shows while the image loads or when an event has no cover.
 */
export const EVENT_TYPE_COVER_COLORS: Record<string, string> = {
  CONFERENCE: "#1C5DD4",
  WORKSHOP: "#32A8FF",
  SEMINAR: "#1C5DD4",
  CONCERT: "#1FC16B",
  FESTIVAL: "#E17100",
  EXHIBITION: "#5AB9FF",
  NETWORKING: "#174FB4",
  TRAINING: "#5AB9FF",
  WEBINAR: "#32A8FF",
  CULTURAL: "#E17100",
  OTHER: "#1C5DD4",
};
