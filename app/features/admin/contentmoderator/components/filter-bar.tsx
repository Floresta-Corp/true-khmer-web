import { ChevronDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { CategoryOption } from "./pages/content-moderator-page";

export const STATUSES = [
  { label: "All", value: "all", color: "slate" },
  { label: "Open", value: "open", color: "emerald" },
  { label: "Closed", value: "closed", color: "rose" },
] as const;

interface FilterBarProps {
  categoryOptions: CategoryOption[];
  selectedTypeId: string | null;
  onCategoryChange: (typeId: string | null) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

function getStatusColor(color: string, isActive: boolean): string {
  const colors: Record<string, string> = {
    slate: isActive
      ? "bg-blue-600/70 text-white"
      : "text-slate-400 hover:bg-slate-50",
    rose: isActive
      ? "bg-rose-600/70 text-white"
      : "text-slate-400 hover:bg-rose-50 hover:text-rose-600",
    emerald: isActive
      ? "bg-emerald-600/70 text-white"
      : "text-slate-400 hover:bg-emerald-50 hover:text-emerald-600",
  };

  return colors[color] ?? "text-slate-400";
}

export function FilterBar({
  categoryOptions,
  selectedTypeId,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
}: FilterBarProps) {
  const selectedLabel =
    selectedTypeId === null
      ? "All Types"
      : (categoryOptions.find((o) => o.id === selectedTypeId)?.name ??
        "Select Type…");

  return (
    <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex flex-wrap items-center gap-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative group">
          <Button className="flex items-center gap-4 px-6 py-3 rounded-2xl text-xs font-black bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 hover:border-blue-500 transition-all cursor-pointer">
            {selectedLabel}
            <ChevronDown size={14} className="opacity-40" />
          </Button>
          <div className="absolute top-full left-0 mt-2 min-w-48 max-h-64 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-black/40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
            {categoryOptions.map((option) => (
              <Button
                variant="ghost"
                key={option.id ?? "__all__"}
                onClick={() => onCategoryChange(option.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-[12px] font-semibold tracking-widest transition-colors cursor-pointer whitespace-nowrap ${
                  selectedTypeId === option.id
                    ? "bg-blue-600 text-white "
                    : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {option.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex p-1.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
          {STATUSES.map((status) => {
            const isActive = selectedStatus === status.value;
            return (
              <Button
                variant="ghost"
                key={status.value}
                onClick={() => onStatusChange(status.value)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-semibold uppercase tracking-widest cursor-pointer transition-all ${getStatusColor(
                  status.color,
                  isActive,
                )}`}
              >
                {status.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
