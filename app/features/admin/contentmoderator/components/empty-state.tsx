import { ShieldAlert } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-20 h-20 rounded-3xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-6 text-slate-300 dark:text-slate-700">
        <ShieldAlert size={40} />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-2">
        No reports found
      </h3>
      <p className="text-sm text-slate-500 max-w-sm mx-auto">
        We couldn't find any reports matching your search criteria. Try a
        different category or status filter.
      </p>
    </div>
  );
}
