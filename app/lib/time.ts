import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function normalizeDateInput(dateInput: Date | string | number) {
  if (typeof dateInput !== "string") {
    return dateInput;
  }

  return dateInput.replace(" ", "T").replace(/([+-]\d{2})$/, "$1:00");
}

export function getMinutesAgo(
  fromDateInput: Date | string | number,
  now = new Date(),
) {
  const fromDate = dayjs(normalizeDateInput(fromDateInput));

  if (!fromDate.isValid()) {
    return null;
  }

  return Math.max(0, dayjs(now).diff(fromDate, "minute"));
}

export function getHoursAgo(
  fromDateInput: Date | string | number,
  now = new Date(),
) {
  const minutesAgo = getMinutesAgo(fromDateInput, now);

  if (minutesAgo === null) {
    return null;
  }

  return Math.floor(minutesAgo / 60);
}

export function formatRelativeTime(
  dateInput: Date | string | number | null | undefined,
  now = new Date(),
) {
  if (dateInput === null || dateInput === undefined || dateInput === "") {
    return "";
  }

  const date = dayjs(normalizeDateInput(dateInput));

  if (!date.isValid()) {
    return "";
  }

  if (dayjs(now).diff(date, "hour") < 24) {
    return date.from(dayjs(now));
  }

  return date.format("MMM D, YYYY, h:mm A");
}

export function formatDate(
  dateInput: Date | string | number | null | undefined,
) {
  if (dateInput === null || dateInput === undefined || dateInput === "") {
    return "";
  }

  const date = dayjs(normalizeDateInput(dateInput));

  if (!date.isValid()) {
    return "";
  }

  return date.format("MMM D, YYYY");
}

export const formatMinutesOrHoursAgo = formatRelativeTime;
