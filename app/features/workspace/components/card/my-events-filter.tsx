import { Search } from "lucide-react";
import { motion } from "motion/react";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import type {
  MyEventFilter,
  MyEventFormatFilter,
} from "~/features/workspace/types/my-events";

const STATUS_TABS = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Live", value: "live" },
  { label: "Ended", value: "ended" },
  { label: "Cancelled", value: "cancelled" },
] as const satisfies ReadonlyArray<{ label: string; value: MyEventFilter }>;

const FORMAT_OPTIONS = [
  { label: "All Formats", value: "all" },
  { label: "In-person", value: "in_person" },
  { label: "Online", value: "online" },
  { label: "Hybrid", value: "hybrid" },
] as const satisfies ReadonlyArray<{
  label: string;
  value: MyEventFormatFilter;
}>;

type Props = {
  filter: MyEventFilter;
  format: MyEventFormatFilter;
  searchInput: string;
  onFilterChange: (value: MyEventFilter) => void;
  onFormatChange: (value: MyEventFormatFilter) => void;
  onSearchChange: (value: string) => void;
};

export default function MyEventsFilters({
  filter,
  format,
  searchInput,
  onFilterChange,
  onFormatChange,
  onSearchChange,
}: Props) {
  return (
    <div className="mt-5 flex w-full flex-wrap items-center justify-between gap-4">
      <div className="scrollbar-none flex w-full max-w-full overflow-x-auto rounded-xl bg-gray-100 p-1 shadow-inner sm:w-max dark:bg-slate-900">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onFilterChange(tab.value)}
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
                layoutId="myEventsActiveTab"
                className="absolute inset-0 z-10 rounded-lg bg-white shadow-sm dark:bg-slate-800"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex w-full min-w-0 items-center gap-3 sm:w-auto">
        <Select
          value={format}
          onValueChange={(value) =>
            onFormatChange(value as MyEventFormatFilter)
          }
        >
          <SelectTrigger className="h-10 w-34 shrink-0 rounded-xl border-none bg-white text-[14px] focus:ring-blue-500/20 md:w-40">
            <SelectValue placeholder="All Formats" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200">
            {FORMAT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative min-w-0 flex-1 sm:w-63 sm:flex-none md:w-72">
          <Search
            size={16}
            className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
          />
          <Input
            className="h-10 rounded-xl border-slate-200 bg-white pr-4 pl-11 text-[14px] transition-all placeholder:font-medium placeholder:text-slate-400 focus-visible:ring-blue-500/20"
            placeholder="Search events..."
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
