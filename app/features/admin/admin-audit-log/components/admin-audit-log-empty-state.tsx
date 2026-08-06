import { ScrollText } from "lucide-react";

export function AdminAuditLogEmptyState() {
  return (
    <div className="flex min-h-80 flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
        <ScrollText className="size-5" />
      </div>
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">
        No activity found
      </h2>
      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
        No administrative actions match the current filters. Try a different
        search term, category, or member.
      </p>
    </div>
  );
}
