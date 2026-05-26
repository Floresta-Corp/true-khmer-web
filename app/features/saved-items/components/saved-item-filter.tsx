import type { LucideIcon } from "lucide-react";

export type FilterId = "all" | "forum" | "volunteer" | "launchpad" | "event";

interface SavedFilterButtonProps {
  id: FilterId;
  label: string;
  icon: LucideIcon;
  count: number;
  isActive: boolean;
  onClick: (id: FilterId) => void;
}

export default function SavedItemsFilter({
  id,
  label,
  icon: Icon,
  count,
  isActive,
  onClick,
}: SavedFilterButtonProps) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`group flex w-full items-center gap-3 rounded-xl p-3 transition-all cursor-pointer ${
        isActive
          ? "bg-indigo-100/40 text-blue-500 font-bold"
          : "text-slate-600 dark:text-slate-400  dark:hover:bg-slate-900/50 font-medium"
      }`}
    >
      <div
        className={`p-1.5 rounded-lg transition-colors ${
          isActive
            ? "bg-blue-500 text-white shadow-sm shadow-brand-blue/20"
            : "bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-slate-200"
        }`}
      >
        <Icon size={16} />
      </div>
      <span className="text-[14px]">{label}</span>
      <span
        className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold ${
          isActive ? "bg-white text-blue-500" : "bg-slate-100 text-slate-400"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
