import { ShieldAlert } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 text-slate-300 dark:bg-slate-800/50 dark:text-slate-700">
        <ShieldAlert size={40} />
      </div>
      <h3 className="mb-2 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
        No reports found
      </h3>
      <p className="mx-auto text-sm text-slate-500">
        We couldn't find any reports matching your search criteria. Try a
        different category or status filter.
      </p>
    </div>
  );
}
