import { cn } from "~/lib/utils";
import type { CourseLevel } from "~/features/education/types";

/**
 * Three ascending bars where the number of filled (blue) bars encodes the
 * level: Beginner 1, Intermediate 2, Advance 3. The remaining bars stay grey.
 *
 * The design uses a meter here rather than a fixed icon, so no single Lucide
 * glyph can stand in — the mark has to change with the value.
 */
const FILLED_BARS: Record<CourseLevel, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advance: 3,
};

const BAR_HEIGHTS = ["h-[5px]", "h-[8px]", "h-[11px]"];

export function CourseLevelMeter({
  level,
  className,
}: {
  level: CourseLevel;
  className?: string;
}) {
  const filled = FILLED_BARS[level] ?? 1;

  return (
    <span
      role="img"
      aria-label={`Level: ${level}`}
      className={cn("inline-flex items-end gap-[2px]", className)}
    >
      {BAR_HEIGHTS.map((height, index) => (
        <span
          key={height}
          className={cn(
            "w-[3px] rounded-[1px]",
            height,
            index < filled ? "bg-[#1C5DD4]" : "bg-[#D1D5DB]",
          )}
        />
      ))}
    </span>
  );
}
