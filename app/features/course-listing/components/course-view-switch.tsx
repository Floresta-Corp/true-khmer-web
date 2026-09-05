import { AlignJustify, LayoutGrid } from "lucide-react";
import { cn } from "~/lib/utils";
import type { CourseView } from "~/features/course-listing/types";

const OPTIONS: {
  value: CourseView;
  label: string;
  icon: typeof LayoutGrid;
}[] = [
  { value: "grid", label: "Grid view", icon: LayoutGrid },
  { value: "list", label: "List view", icon: AlignJustify },
];

/**
 * The two-button segmented control beside the search field. The active button
 * carries the outline, as the design shows, and `aria-pressed` states it for
 * assistive tech since neither button is a link.
 */
export function CourseViewSwitch({
  view,
  onChange,
  className,
}: {
  view: CourseView;
  onChange: (view: CourseView) => void;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label="Course layout"
      className={cn(
        "flex shrink-0 items-center gap-1 rounded-xl border border-slate-200 bg-white p-1",
        className,
      )}
    >
      {OPTIONS.map((option) => {
        const Icon = option.icon;
        const isActive = view === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            title={option.label}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex size-9 cursor-pointer items-center justify-center rounded-lg border transition-colors",
              isActive
                ? "border-[#305CCD] bg-white text-[#305CCD]"
                : "border-transparent text-[#9A9AB0] hover:bg-slate-50 hover:text-[#10101E]",
            )}
          >
            <Icon size={18} strokeWidth={2.2} aria-hidden />
            <span className="sr-only">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
