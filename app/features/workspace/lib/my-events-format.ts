import type {
  CreateEventDateInput,
  CreateEventFormat,
  CreateEventFormState,
  EventEntryMode,
  EventRegistrationMode,
  EventVisibility,
  MyEventStatus,
} from "~/features/workspace/types/my-events";

export const MY_EVENT_FORMAT_LABELS: Record<CreateEventFormat, string> = {
  IN_PERSON: "In-person",
  ONLINE: "Online",
};

export const MY_EVENT_STATUS_LABELS: Record<MyEventStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ACTIVE: "Live",
  COMPLETED: "Ended",
  CANCELLED: "Cancelled",
  POSTPONED: "Postponed",
  ARCHIVED: "Archived",
};

/**
 * "Mon, Sep 21" for a single day, "Sep 12 – 14" across days in one month and
 * "Sep 30 – Oct 2" across months.
 */
export function formatMyEventDateRange(
  startAt: string | null,
  endAt: string | null,
): string {
  const start = toDate(startAt);
  if (!start) return "Date to be announced";

  const end = toDate(endAt);
  if (!end || isSameDay(start, end)) {
    return start.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  const startLabel = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const endLabel = end.toLocaleDateString(
    "en-US",
    start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear()
      ? { day: "numeric" }
      : { month: "short", day: "numeric" },
  );

  return `${startLabel} \u2013 ${endLabel}`;
}

/** "8:00 AM – 5:00 PM" for the second meta line on the card. */
export function formatMyEventTimeRange(
  startAt: string | null,
  endAt: string | null,
): string {
  const start = toDate(startAt);
  if (!start) return "Time to be announced";

  const end = toDate(endAt);
  const startLabel = formatClockTime(start);

  return end ? `${startLabel} \u2013 ${formatClockTime(end)}` : startLabel;
}

function toDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString();
}

function formatClockTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
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
  revenue: number | null,
  currencyCode: string,
): string {
  if (!revenue || revenue <= 0) return "$0";

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
  ticketsSold: number | null,
  ticketCapacity: number | null,
): string {
  const sold = ticketsSold ?? 0;
  return ticketCapacity === null ? `${sold}` : `${sold}/${ticketCapacity}`;
}

/** Every required field of the basics step is filled in. */
export function isCreateEventFormComplete(form: CreateEventFormState): boolean {
  return Boolean(
    form.name.trim() &&
    form.organizerId &&
    form.category &&
    form.description.trim() &&
    form.format === "IN_PERSON" &&
    form.eventDates.length > 0 &&
    form.eventDates.every(
      (eventDate) => eventDate.date && eventDate.startTime && eventDate.endTime,
    ) &&
    form.venueId &&
    form.address.trim() &&
    form.coverImageName,
  );
}

/** Convert the browser-local date/time inputs to the API's UTC timestamps. */
export function getCreateEventDateRange(eventDate: CreateEventDateInput) {
  const start = new Date(`${eventDate.date}T${eventDate.startTime}:00`);
  const end = new Date(`${eventDate.date}T${eventDate.endTime}:00`);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end <= start
  ) {
    return null;
  }

  return { startAt: start.toISOString(), endAt: end.toISOString() };
}

/** Convert every entered day, rejecting the whole set when any row is invalid. */
export function getCreateEventDateRanges(form: CreateEventFormState) {
  const ranges = form.eventDates.map(getCreateEventDateRange);
  return ranges.every((range) => range !== null) ? ranges : null;
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
