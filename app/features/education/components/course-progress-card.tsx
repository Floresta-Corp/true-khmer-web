import { cn } from "~/lib/utils";
import { CARD } from "~/features/education/lib/education-styles";

interface CourseProgressCardProps {
  completedCount: number;
  totalCount: number;
}

export function CourseProgressCard({
  completedCount,
  totalCount,
}: CourseProgressCardProps) {
  const percent =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  const isComplete = percent === 100;

  return (
    <div className={`${CARD} p-5`}>
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-sm font-bold text-[#1A1A2E]">
          Course completion
        </span>
        <span
          className={cn(
            "text-sm font-bold",
            isComplete ? "text-[#1FC16B]" : "text-[#1C5DD4]",
          )}
        >
          {percent}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Course completion"
        className="h-2 overflow-hidden rounded-sm bg-[#E8E8E8]"
      >
        <div
          className={cn(
            "h-full rounded-sm transition-[width]",
            isComplete ? "bg-[#1FC16B]" : "bg-[#1C5DD4]",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
