import { Search } from "lucide-react";
import { motion } from "motion/react";

import { Input } from "~/components/ui/input";
import {
  ALL_STATUSES,
  COURSE_STATUS_OPTIONS,
  toStatusParam,
} from "~/features/admin/manage-education/types";
import { cn } from "~/lib/utils";

export const STATUS_TABS = [
  { value: ALL_STATUSES, label: "All" },
  ...COURSE_STATUS_OPTIONS.map((option) => ({
    value: toStatusParam(option.value),
    label: option.label,
  })),
];

interface ManageEducationFiltersProps {
  status: string;
  searchInput: string;
  onStatusChange: (status: string) => void;
  onSearchChange: (value: string) => void;
}

export function ManageEducationFilters({
  status,
  searchInput,
  onStatusChange,
  onSearchChange,
}: ManageEducationFiltersProps) {
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-4">
      <div className="scrollbar-hide flex w-full max-w-full overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 sm:w-max dark:border-slate-800 dark:bg-slate-900">
        {STATUS_TABS.map((item) => {
          const isActive = status === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onStatusChange(item.value)}
              aria-pressed={isActive}
              className="relative z-10 shrink-0 cursor-pointer px-6 py-2 text-[15px] font-bold whitespace-nowrap transition-colors duration-300"
            >
              <span
                className={cn(
                  "relative z-20",
                  isActive
                    ? "text-[#305CCD] dark:text-sky-400"
                    : "text-[#7D7D7D] dark:text-slate-400",
                )}
              >
                {item.label}
              </span>

              {isActive && (
                <motion.div
                  layoutId="manageEducationActiveTab"
                  className="absolute inset-0 z-10 rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="relative w-full min-w-0 sm:w-60 md:w-72">
        <Search
          size={16}
          className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
        />
        <Input
          className="h-11 rounded-xl border-slate-200 bg-white pr-4 pl-11 text-[14px] transition-all placeholder:font-medium placeholder:text-slate-400 focus-visible:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900"
          placeholder="Search courses..."
          aria-label="Search courses"
          value={searchInput}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
    </div>
  );
}
