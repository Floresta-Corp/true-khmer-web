import type {
  CreateEventFormState,
  EventEntryMode,
  EventRegistrationMode,
  EventVisibility,
  MyEventFormat,
  MyEventStatus,
} from "~/features/workspace/types/my-events";

export const MY_EVENT_STATUS_LABELS: Record<MyEventStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  LIVE: "Live",
  ENDED: "Ended",
  CANCELLED: "Cancelled",
};

export const MY_EVENT_FORMAT_LABELS: Record<MyEventFormat, string> = {
  IN_PERSON: "In-person",
  ONLINE: "Online",
  HYBRID: "Hybrid",
};

/** "Thu, Mar 12 • 8:00 AM" — the meta line on the listing card. */
export function formatMyEventDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date to be announced";

  const day = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${day} • ${time}`;
}

/** "8:00 AM" from an `<input type="time">` value. */
export function formatTimeInputValue(value: string): string {
  const [hours, minutes] = value.split(":");
  const hour = Number(hours);
  if (!value || Number.isNaN(hour)) return "";

  const suffix = hour >= 12 ? "PM" : "AM";
  const normalizedHour = hour % 12 === 0 ? 12 : hour % 12;

  return `${normalizedHour}:${minutes ?? "00"} ${suffix}`;
}

export function formatMyEventRevenue(
  revenue: number,
  currencyCode: string,
): string {
  if (revenue <= 0) return "—";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(revenue);
  } catch {
    return `${revenue}`;
  }
}

export function formatMyEventTickets(
  ticketsSold: number,
  ticketCapacity: number | null,
): string {
  if (ticketCapacity === null) return ticketsSold > 0 ? `${ticketsSold}` : "—";
  return `${ticketsSold}/${ticketCapacity}`;
}

export function formatMyEventAttendance(
  attendanceCount: number | null,
): string {
  return attendanceCount === null ? "—" : `${attendanceCount}`;
}

/** Every required field of the basics step is filled in. */
export function isCreateEventFormComplete(form: CreateEventFormState): boolean {
  return Boolean(
    form.name.trim() &&
    form.organizerId &&
    form.category &&
    form.description.trim() &&
    form.format &&
    form.startDate &&
    form.startTime &&
    form.endTime &&
    form.coverImageName,
  );
}

/** Convert the browser-local date/time inputs to the API's UTC timestamps. */
export function getCreateEventDateRange(form: CreateEventFormState) {
  const start = new Date(`${form.startDate}T${form.startTime}:00`);
  const end = new Date(`${form.startDate}T${form.endTime}:00`);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end <= start
  ) {
    return null;
  }

  return { startAt: start.toISOString(), endAt: end.toISOString() };
}

/** "8:00 AM – 11:00 AM" for the review step. */
export function formatCreateEventTimeRange(
  startTime: string,
  endTime: string,
): string {
  const start = formatTimeInputValue(startTime);
  const end = formatTimeInputValue(endTime);

  if (!start && !end) return "Time to be announced";
  if (!end) return start;
  if (!start) return end;

  return `${start} – ${end}`;
}

/**
 * "Thursday, 12 March 2026" from an `<input type="date">` value. Parsed as a
 * local date so the label never slips a day on negative UTC offsets.
 */
export function formatDateInputValue(value: string): string {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return "Date to be announced";

  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const EVENT_VISIBILITY_LABELS: Record<EventVisibility, string> = {
  LISTED: "Listed",
  UNLISTED: "Unlisted",
};

export const EVENT_REGISTRATION_LABELS: Record<EventRegistrationMode, string> =
  {
    ANYONE: "Anyone",
    REQUIRED_APPROVAL: "Required approval",
    INVITED_GUESTS_ONLY: "Invited guests only",
  };

export const EVENT_ENTRY_LABELS: Record<EventEntryMode, string> = {
  TICKETED: "Ticketed",
  RSVP: "RSVP",
  OPEN_ACCESS: "Open access",
};

/** Approval and invite-only registration both gate who gets in. */
export function isRestrictedRegistration(
  registrationMode: EventRegistrationMode,
): boolean {
  return (
    registrationMode === "REQUIRED_APPROVAL" ||
    registrationMode === "INVITED_GUESTS_ONLY"
  );
}

/** Open access contradicts a gated guest list, so the pair is not allowed. */
export function isOpenEntryDisabled(
  registrationMode: EventRegistrationMode,
  entryMode: EventEntryMode,
): boolean {
  return (
    entryMode === "OPEN_ACCESS" && isRestrictedRegistration(registrationMode)
  );
}
