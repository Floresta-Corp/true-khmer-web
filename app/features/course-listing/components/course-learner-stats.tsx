import { cn } from "~/lib/utils";
import type { CourseLearnerStats as Stats } from "~/features/course-listing/types";

/**
 * The four-column engagement strip a published row shows. A rule separates the
 * total from the three breakdown columns, matching the design.
 */
export function CourseLearnerStats({
  stats,
  className,
}: {
  stats: Stats;
  className?: string;
}) {
  const columns = [
    {
      label: "Completed",
      value: `${stats.completed.percent}%`,
      caption: `${stats.completed.learners.toLocaleString()} Learners`,
    },
    {
      label: "In progress",
      value: `${stats.inProgress.percent}%`,
      caption: `${stats.inProgress.learners.toLocaleString()} Learners`,
    },
    {
      label: "Not started",
      value: `${stats.notStarted.percent}%`,
      caption: `${stats.notStarted.learners.toLocaleString()} Learners`,
    },
  ];

  return (
    <div className={cn("shrink-0 items-start gap-9", className)}>
      <div className="pr-9">
        <p className="text-[12px] text-[#86869E]">Total learners</p>
        <p className="text-[18px] leading-tight font-bold text-[#10101E]">
          {stats.totalLearners.toLocaleString()}
        </p>
        <p className="text-[11px] text-[#83839B]">Learners</p>
      </div>

      {columns.map((column, index) => (
        <div
          key={column.label}
          className={cn(index === 0 && "border-l border-[#E5E7EB] pl-9")}
        >
          <p className="text-[12px] whitespace-nowrap text-[#86869E]">
            {column.label}
          </p>
          <p className="text-[18px] leading-tight text-[#10101E]">
            {column.value}
          </p>
          <p className="text-[11px] whitespace-nowrap text-[#83839B]">
            {column.caption}
          </p>
        </div>
      ))}
    </div>
  );
}
