import { memo } from "react";
import { ChevronDown } from "lucide-react";
import { CATEGORIES, STATUSES } from "~/features/admin/contentmoderator/types";

// ── helper: active color class for each status button ─────────────────────
function getStatusColor(color: string, isActive: boolean): string {
  const base: Record<string, string> = {
    slate: isActive
      ? "bg-blue-600 text-white"
      : "text-slate-400 hover:bg-[#1c2235]",
    rose: isActive
      ? "bg-rose-500 text-white"
      : "text-slate-400 hover:bg-rose-900/30 hover:text-rose-400",
    emerald: isActive
      ? "bg-emerald-500 text-white"
      : "text-slate-400 hover:bg-emerald-900/30 hover:text-emerald-400",
  };
  return base[color] ?? "text-slate-400";
}

interface FilterBarProps {
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

// ── FilterBar ─────────────────────────────────────────────────────────────-
// Category dropdown + status tab buttons.

export const FilterBar = memo(function FilterBar({
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
      <div className="flex items-center gap-4">
        {/* ─── Category Dropdown ─────────────────────────────────────────── */}
        <div className="relative group">
          <button className="flex items-center gap-4 px-6 py-3 rounded-2xl text-xs font-black bg-[#0f1422] border border-[#1c2235] text-white hover:border-blue-500 transition-all cursor-pointer">
            {selectedCategory}
            <ChevronDown size={14} className="opacity-40" />
          </button>
          <div className="absolute top-full left-0 mt-2 w-48 bg-[#0f1422] border border-[#1c2235] rounded-2xl shadow-xl shadow-black/40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-colors ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-[#1c2235]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Status Tabs ────────────────────────────────────────────── */}
        <div className="flex p-1.5 bg-[#0f1422] border border-[#1c2235] rounded-2xl">
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
