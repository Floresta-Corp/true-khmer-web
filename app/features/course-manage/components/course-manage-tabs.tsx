import { cn } from "~/lib/utils";
import {
  MANAGE_TABS,
  MANAGE_TAB_LABELS,
  type ManageTab,
} from "~/features/course-manage/types";

interface CourseManageTabsProps {
  active: ManageTab;
  onChange: (tab: ManageTab) => void;
}

/** Underlined tabs sitting on a full-width hairline, as in the design. */
export function CourseManageTabs({ active, onChange }: CourseManageTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Course sections"
      className="scrollbar-hide mb-7 flex gap-7 overflow-x-auto border-b border-[#E5E7EB]"
    >
      {MANAGE_TABS.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab)}
            className={cn(
              "-mb-px shrink-0 cursor-pointer border-b-2 pb-3 text-[15px] whitespace-nowrap transition-colors",
              isActive
                ? "border-[#1C5DD4] font-semibold text-[#1C5DD4]"
                : "border-transparent font-medium text-[#9A9AB0] hover:text-[#1A1A2E]",
            )}
          >
            {MANAGE_TAB_LABELS[tab]}
          </button>
        );
      })}
    </div>
  );
}
