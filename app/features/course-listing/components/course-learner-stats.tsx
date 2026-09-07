import { cn } from "~/lib/utils";
import type { CourseLearnerStats as Stats } from "~/features/course-listing/types";

/**
 * The engagement strip a row shows once a course has learners: the enrolled
 * total, then the three-way split of it, divided by the design's rule.
 *
 * `display` is left to the caller — the row hides the strip below `lg`, where
 * there is no width for four columns of figures.
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
    <div className={cn("shrink-0 items-start gap-4", className)}>
      <div>
        <p className="text-[12px] whitespace-nowrap text-[#86869E]">
          Total learners
        </p>
        <p className="text-[18px] leading-tight font-bold text-[#10101E]">
          {stats.totalLearners.toLocaleString()}
        </p>
        <p className="text-[11px] text-[#83839B]">Learners</p>
      </div>

      {/* The total is the whole and the three columns are its split, so the
          rule sits between them. Deep enough for the label and the figure
          only, as the design draws it — not the caption beneath. */}
      <span aria-hidden className="h-9 w-px shrink-0 bg-[#E5E7EB]" />

      <div className="flex items-start gap-8">
        {columns.map((column) => (
          <div key={column.label}>
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
    </div>
  );
}
