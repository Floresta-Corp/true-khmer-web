import { Search } from "lucide-react";
import { motion } from "motion/react";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import {
  TABS,
  type CourseTab,
  type CourseView,
} from "~/features/course-listing/types";
import { CourseViewSwitch } from "./course-view-switch";

interface CourseListingFiltersProps {
  tab: CourseTab;
  searchInput: string;
  view: CourseView;
  onTabChange: (tab: CourseTab) => void;
  onSearchChange: (value: string) => void;
  onViewChange: (view: CourseView) => void;
}

export function CourseListingFilters({
  tab,
  searchInput,
  view,
  onTabChange,
  onSearchChange,
  onViewChange,
}: CourseListingFiltersProps) {
  return (
    <div className="mt-5 flex w-full flex-wrap items-center justify-between gap-4">
      <div className="scrollbar-hide flex w-full max-w-full overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 sm:w-max">
        {TABS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onTabChange(item.value)}
            aria-pressed={tab === item.value}
            className="relative z-10 shrink-0 cursor-pointer px-6 py-2 text-[15px] font-bold whitespace-nowrap transition-colors duration-300"
          >
            <span
              className={cn(
                "relative z-20",
                tab === item.value ? "text-[#305CCD]" : "text-[#7D7D7D]",
              )}
            >
              {item.label}
            </span>

            {tab === item.value && (
              <motion.div
                layoutId="courseListingActiveTab"
                className="absolute inset-0 z-10 rounded-lg border border-slate-200 bg-white shadow-sm"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex w-full min-w-0 items-center gap-3 sm:w-auto">
        <div className="relative min-w-0 flex-1 sm:w-60 sm:flex-none md:w-72">
          <Search
            size={16}
            className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
          />
          <Input
            className="h-11 rounded-xl border-slate-200 bg-white pr-4 pl-11 text-[14px] transition-all placeholder:font-medium placeholder:text-slate-400 focus-visible:ring-blue-500/20"
            placeholder="Search courses..."
            aria-label="Search courses"
            value={searchInput}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>

        <CourseViewSwitch view={view} onChange={onViewChange} />
      </div>
    </div>
  );
}
