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
    <div className="flex items-center justify-between gap-4 flex-wrap w-full m-4">
      <div className="flex bg-gray-100 dark:bg-slate-900 p-1 rounded-xl shadow-inner sm:w-max">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onFilterChange(tab.value as FilterType)}
            aria-pressed={filter === tab.value}
            className="relative px-5 py-1.5 text-[14px] font-bold transition-colors duration-300 cursor-pointer z-10"
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
                className="absolute inset-0 bg-white dark:bg-slate-800 rounded-lg shadow-sm z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Select
          value={activeType}
          onValueChange={(value) => onTypeChange(value as TabType)}
        >
          <SelectTrigger className="w-30 md:w-36 h-10 text-[14px] font-medium border-slate-200 bg-white rounded-xl focus:ring-blue-500/20">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="projects">Project</SelectItem>
            <SelectItem value="volunteer">Volunteer</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative w-56">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            className="h-10 pl-11 pr-4 text-[14px] border-slate-200 bg-white rounded-xl focus-visible:ring-blue-500/20 placeholder:text-slate-400 placeholder:font-medium transition-all"
            placeholder="Search postings name..."
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
