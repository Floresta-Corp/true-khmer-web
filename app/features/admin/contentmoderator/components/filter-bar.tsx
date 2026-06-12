import { memo } from "react";
import { ChevronDown } from "lucide-react";
import { CATEGORIES, STATUSES } from "~/features/admin/contentmoderator/types";

interface FilterBarProps {
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

function getStatusColor(color: string, isActive: boolean): string {
  const colors: Record<string, string> = {
    slate: isActive ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-50",
    rose: isActive
      ? "bg-rose-500 text-white"
      : "text-slate-400 hover:bg-rose-50 hover:text-rose-600",
    amber: isActive
      ? "bg-amber-500 text-white"
      : "text-slate-400 hover:bg-amber-50 hover:text-amber-600",
    emerald: isActive
      ? "bg-emerald-500 text-white"
      : "text-slate-400 hover:bg-emerald-50 hover:text-emerald-600",
    yellow: isActive
      ? "bg-yellow-400 text-slate-950"
      : "text-slate-400 hover:bg-yellow-50 hover:text-yellow-600",
  };

  return colors[color] ?? "text-slate-400";
}

export const FilterBar = memo(function FilterBar({
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
}: FilterBarProps) {
  return (
    <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex flex-wrap items-center gap-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative group">
          <button className="flex items-center gap-4 px-6 py-3 rounded-2xl text-xs font-black bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 hover:border-blue-500 transition-all cursor-pointer">
            {selectedCategory}
            <ChevronDown size={14} className="opacity-40" />
          </button>
          <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-black/40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex p-1.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
          {STATUSES.map((status) => {
            const isActive = selectedStatus === status.value;
            return (
              <button
                key={status.value}
                onClick={() => onStatusChange(status.value)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${getStatusColor(
                  status.color,
                  isActive,
                )}`}
              >
                {status.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});
