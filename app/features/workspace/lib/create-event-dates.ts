import type { CreateEventDateInput } from "~/features/workspace/types/my-events";

/** How often the date fields re-read the clock so limits stay current. */
export const CREATE_EVENT_CLOCK_INTERVAL_MS = 30_000;

/** `yyyy-mm-dd` in the visitor's own timezone, the format a date input wants. */
export function toDateInputValue(value: Date) {
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");
  return `${value.getFullYear()}-${month}-${day}`;
}

/** The day after a `yyyy-mm-dd` value, month and year rollovers included. */
export function nextDateInputValue(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return toDateInputValue(new Date(year, month - 1, day + 1));
}

/** `HH:MM` in the visitor's own timezone, the format a time input wants. */
export function toTimeInputValue(value: Date) {
  const hours = `${value.getHours()}`.padStart(2, "0");
  const minutes = `${value.getMinutes()}`.padStart(2, "0");
  return `${hours}:${minutes}`;
}

export type CreateEventDateLimits = {
  /** Earliest day the picker offers — today, or the day after the row above. */
  minDate: string;
  /** Set only while the row sits on today, so past hours cannot be picked. */
  minStartTime?: string;
  /** The later of the start time and today's floor. */
  minEndTime?: string;
  dateError?: string;
  startTimeError?: string;
  endTimeError?: string;
};

/**
 * Native `min` attributes stop the pickers from offering past slots, but a
 * value can still be stale — typed by hand, restored from a draft, or simply
 * overtaken by the clock while the form sits open — so the same boundaries are
 * re-checked here and surfaced as inline errors.
 *
 * Times only mean anything next to the day they sit on: on a future day every
 * hour is still ahead, so both times are compared against the clock only while
 * the row is on today. `HH:MM` strings compare correctly as plain text.
 */
export function getCreateEventDateLimits(
  eventDate: CreateEventDateInput,
  now: Date,
  previousDate?: string,
): CreateEventDateLimits {
  const today = toDateInputValue(now);
  const nowTime = toTimeInputValue(now);
  /**
   * Every row is a separate day of the same event, so day 2 opens the morning
   * after day 1 — the floor moves down the list rather than staying at today.
   */
  const minDate =
    previousDate && nextDateInputValue(previousDate) > today
      ? nextDateInputValue(previousDate)
      : today;
  const isToday = eventDate.date === today;

  const minStartTime = isToday ? nowTime : undefined;
  const minEndTime =
    [eventDate.startTime, minStartTime]
      .filter((value): value is string => Boolean(value))
      .sort()
      .at(-1) ?? undefined;

  const dateError = !eventDate.date
    ? undefined
    : eventDate.date < today
      ? "Event date can't be in the past"
      : eventDate.date < minDate
        ? "Must be a later day than the day above"
        : undefined;

  const isStartPast = Boolean(
    isToday && eventDate.startTime && eventDate.startTime < nowTime,
  );
  const isEndPast = Boolean(
    isToday && eventDate.endTime && eventDate.endTime < nowTime,
  );

  const startTimeError =
    !dateError && isStartPast ? "Start time has already passed" : undefined;

  /**
   * A past end time is the more useful thing to say when both are wrong — the
   * ordering complaint would only send the creator back to a start time that
   * has already passed too.
   */
  const endTimeError = dateError
    ? undefined
    : isEndPast
      ? "End time has already passed"
      : eventDate.startTime &&
          eventDate.endTime &&
          eventDate.endTime <= eventDate.startTime
        ? "End time must be after the start time"
        : undefined;

  return {
    minDate,
    minStartTime,
    minEndTime,
    dateError,
    startTimeError,
    endTimeError,
  };
}

/** True when any row still holds a past, out-of-order, or inverted value. */
export function hasInvalidCreateEventDates(
  dates: CreateEventDateInput[],
  now: Date,
) {
  return dates.some((eventDate, index) => {
    const limits = getCreateEventDateLimits(
      eventDate,
      now,
      dates[index - 1]?.date,
    );
    return Boolean(
      limits.dateError || limits.startTimeError || limits.endTimeError,
    );
  });
}
