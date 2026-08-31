import { Search } from "lucide-react";
import { motion } from "motion/react";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import type { MyEventFilter } from "~/features/workspace/types/my-events";

/** Segmented tabs; Archived sits outside the group as its own toggle. */
const STATUS_TABS = [
  { label: "All", value: "all" },
  { label: "Published", value: "published" },
  { label: "Ended", value: "ended" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Draft", value: "draft" },
] as const satisfies ReadonlyArray<{ label: string; value: MyEventFilter }>;

type Props = {
  filter: MyEventFilter;
  searchInput: string;
  /** Live is only offered while at least one event is actually running. */
  hasLiveEvents: boolean;
  onFilterChange: (value: MyEventFilter) => void;
  onSearchChange: (value: string) => void;
};

export default function MyEventsFilters({
  filter,
  searchInput,
  hasLiveEvents,
  onFilterChange,
  onSearchChange,
}: Props) {
  const isArchived = filter === "archived";
  const isLive = filter === "live";

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-4">
      <div className="flex min-w-0 flex-wrap items-center gap-1.5">
        {hasLiveEvents && (
          <button
            onClick={() => onFilterChange(isLive ? "all" : "live")}
            aria-pressed={isLive}
            className={cn(
              "flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border px-4 py-[9px] text-[14px] whitespace-nowrap transition-colors",
              isLive
                ? "border-[#FB3748] bg-[#FB3748] font-bold text-white"
                : "border-current font-semibold text-[#FB3748] hover:bg-[#FB3748]/10",
            )}
          >
            <span className="size-1.5 rounded-full bg-current" />
            Live
          </button>
        )}

        <div className="scrollbar-none flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-xl bg-[#F7F7F7] p-[5px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
          {STATUS_TABS.map((tab) => {
            const isActive = filter === tab.value;

            return (
              <button
                key={tab.value}
                onClick={() => onFilterChange(tab.value)}
                aria-pressed={isActive}
                className="relative z-10 shrink-0 cursor-pointer rounded-lg px-[18px] py-[9px] text-[14px] whitespace-nowrap"
              >
                <span
                  className={cn(
                    "relative z-20",
                    isActive
                      ? "font-bold text-[#1C5DD4]"
                      : "font-semibold text-[#8E8E8E]",
                  )}
                >
                  {tab.label}
                </span>

                {isActive && (
                  <motion.span
                    layoutId="myEventsActiveTab"
                    className="absolute inset-0 z-10 rounded-lg bg-white shadow-[0_1px_2px_rgba(26,26,46,0.08)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onFilterChange(isArchived ? "all" : "archived")}
          aria-pressed={isArchived}
          className={cn(
            "shrink-0 cursor-pointer rounded-lg px-4 py-[9px] text-[14px] whitespace-nowrap transition-colors",
            isArchived
              ? "bg-[#1C5DD4] font-bold text-white"
              : "font-semibold text-[#9A9AB0] hover:bg-[#F7F7F7]",
          )}
        >
          Archived
        </button>
      </div>

      <div className="relative w-full min-w-37.5 sm:w-57.5">
        <Search
          size={15}
          className="absolute top-1/2 left-3.5 -translate-y-1/2 text-[#9A9AB0]"
        />
        <Input
          className="h-auto rounded-lg border-[#E5E7EB] bg-white py-[11px] pr-3.5 pl-9 text-[14px] text-[#333] shadow-none transition-all placeholder:text-[#9A9AB0] focus-visible:ring-[#1C5DD4]/20"
          placeholder="Search events"
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
