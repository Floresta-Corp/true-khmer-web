import type { PartnerAddress } from "../types";

export function getPackageBadgeClasses(packageType: string): string {
  switch (packageType) {
    case "Platinum":
    case "ប្លាទីន":
      return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300";
    case "Gold":
    case "មាស":
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300";
    case "Silver":
    case "ប្រាក់":
      return "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-300";
    case "Bronze":
    case "សំរិទ្ធ":
      return "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300";
    case "Government":
    case "រដ្ឋាភិបាល":
      return "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-300";
    case "SME":
    case "Video":
    case "វីដេអូ":
      return "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950/50 dark:text-purple-300";
    default:
      // Free / ឥតគិតថ្លៃ and any unknown tier
      return "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400";
  }
}

export function getStatusBadgeClasses(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300";
    case "PENDING":
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300";
    default:
      return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300";
  }
}

export function getPublishBadgeClasses(isPublished: boolean): string {
  return isPublished
    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300"
    : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400";
}

export function formatPartnerDate(
  value: string | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  },
): string {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export function formatPartnerDateTime(value: string | null | undefined) {
  return formatPartnerDate(value, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatPartnerAddress(
  address: PartnerAddress | null | undefined,
): string | null {
  if (!address) return null;
  const parts = [address.street, address.city, address.zipCode, address.country]
    .filter((part): part is string => typeof part === "string" && part.trim() !== "");
  return parts.length > 0 ? parts.join(", ") : null;
}
