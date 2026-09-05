import { cn } from "~/lib/utils";
import {
  TAB_LABELS,
  type MyClassCounts,
  type MyClassTab,
} from "~/features/my-classes/types";

const TABS: MyClassTab[] = ["learning", "in-progress", "saved", "completed"];

export function MyClassesTabs({
  active,
  counts,
  onChange,
}: {
  active: MyClassTab;
  counts: MyClassCounts;
  onChange: (tab: MyClassTab) => void;
}) {
  return (
    <div className="border-b border-[#e2e8f0]">
      <div
        role="tablist"
        aria-label="My classes"
        className="scrollbar-hide -mx-1 -mb-px flex items-center gap-6 overflow-x-auto px-1"
      >
        {TABS.map((tab) => {
          const isActive = tab === active;
          const count = counts[tab];

          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab)}
              className={cn(
                "shrink-0 cursor-pointer border-b-2 pb-3 text-sm font-medium whitespace-nowrap transition-colors",
                isActive
                  ? "border-[#1C5DD4] text-[#1C5DD4]"
                  : "border-transparent text-[#6B7280] hover:text-[#344256]",
              )}
            >
              {TAB_LABELS[tab]}
              {count > 0 && (
                <span
                  className={cn(
                    "ml-1.5 text-xs font-semibold",
                    isActive ? "text-[#1C5DD4]" : "text-[#9CA3AF]",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
