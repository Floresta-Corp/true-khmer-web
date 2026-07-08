import { formatDistanceToNow } from "date-fns";

/**
 * Format a date/timestamp as a relative, human-readable string
 * (e.g. "5 minutes ago"). Accepts Date objects, ISO strings, or epoch numbers.
 * Returns an empty string for missing or invalid values so callers can render
 * it directly without guarding.
 */
export function formatRelativeTime(
  value: string | number | Date | null | undefined,
): string {
  if (value === null || value === undefined) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return formatDistanceToNow(date, { addSuffix: true });
}
