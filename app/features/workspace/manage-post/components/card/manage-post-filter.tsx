import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { motion } from "motion/react";
type TabType = "all" | "projects" | "volunteer";

type FilterType =
  | "all"
  | "live"
  | "draft"
  | "in_progress"
  | "canceled"
  | "completed"
  | "filled";
const STATUS_TABS = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Live", value: "live" },
  { label: "In-progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "canceled" },
] as const;
type Props = {
  activeType: TabType;
  filter: FilterType;
  searchInput: string;
  onTypeChange: (type: TabType) => void;
  onFilterChange: (value: FilterType) => void;
  onSearchChange: (value: string) => void;
};

export default function ManagePostFilters({
  activeType,
  filter,
  searchInput,
  onTypeChange,
  onFilterChange,
  onSearchChange,
}: Props) {
  return (
    <div className="mt-5 flex w-full flex-wrap items-center justify-between gap-4">
      <div className="scrollbar-hide flex w-full max-w-full overflow-x-auto rounded-xl bg-gray-100 p-1 shadow-inner sm:w-max dark:bg-slate-900">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onFilterChange(tab.value as FilterType)}
            aria-pressed={filter === tab.value}
            className="relative z-10 shrink-0 cursor-pointer px-5 py-2 text-[14px] font-bold whitespace-nowrap transition-colors duration-300 sm:px-5 sm:text-[14px]"
          >
            <span
              className={cn(
                "relative z-20",
                filter === tab.value
                  ? "text-blue-600 dark:text-white"
                  : "text-gray-500",
              )}
            >
              {tab.label}
            </span>

            {filter === tab.value && (
              <motion.div
                layoutId="managePostActiveTab"
                className="absolute inset-0 z-10 rounded-lg bg-white shadow-sm dark:bg-slate-800"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex w-full min-w-0 items-center gap-3 sm:w-auto">
        <Select
          value={activeType}
          onValueChange={(value) => onTypeChange(value as TabType)}
        >
          <SelectTrigger className="h-10 w-30 shrink-0 rounded-xl border-none bg-white text-[14px] focus:ring-blue-500/20 md:w-36">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="projects">Project</SelectItem>
            <SelectItem value="volunteer">Volunteer</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative min-w-0 flex-1 sm:w-63 sm:flex-none md:w-72">
          <Search
            size={16}
            className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
          />
          <Input
            className="h-10 rounded-xl border-slate-200 bg-white pr-4 pl-11 text-[14px] transition-all placeholder:font-medium placeholder:text-slate-400 focus-visible:ring-blue-500/20"
            placeholder="Search postings..."
            value={searchInput}
            onChange={(e) => {
              onSearchChange(e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
}
