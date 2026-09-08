import { format } from "date-fns";
function formatDate(value: string, pattern: string, fallback: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : format(date, pattern);
}
export const FormatDateRange = (value: string) =>
  formatDate(value, "MMM dd, yyyy", "Date TBA");
export const formatEventTimeRange = (value: string) =>
  formatDate(value, "h:mm a", "Time TBA");
