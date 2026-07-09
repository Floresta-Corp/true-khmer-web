// Adapted from the old app's `getPackageBadgeColor` (daisyUI badge classes) to
// shadcn/Tailwind outline pills that match the new admin dashboard palette.
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

export function formatRegistrationDate(value: string | null | undefined): string {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
