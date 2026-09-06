import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "~/lib/utils";
import type { ProgressSegment } from "~/features/course-manage/types";
import { RING_RADIUS, buildRingArcs } from "../../lib/chart-geometry";
import { MANAGE_CARD } from "./course-kpi-cards";

interface StudentProgressCardProps {
  total: number;
  segments: ProgressSegment[];
  courseId: string;
}

export function StudentProgressCard({
  total,
  segments,
  courseId,
}: StudentProgressCardProps) {
  // Largest arc first so the ring reads clockwise from twelve o'clock.
  const ordered = [...segments].reverse();
  const arcs = buildRingArcs(ordered.map((segment) => segment.learners));

  return (
    <div className={`${MANAGE_CARD} flex h-full flex-col p-6`}>
      <h3 className="mb-5 text-base font-bold text-[#1A1A2E]">
        Student progress
      </h3>

      <div className="flex flex-1 flex-wrap items-center gap-7">
        <div className="relative size-[130px] shrink-0">
          <svg
            viewBox="0 0 120 120"
            width={130}
            height={130}
            role="img"
            aria-label="Student progress breakdown"
          >
            {/* Always drawn, so an empty course reads as a neutral track rather
                than a full ring in whichever colour happened to come first. */}
            <circle
              cx={60}
              cy={60}
              r={RING_RADIUS}
              fill="none"
              stroke="#F1F1F4"
              strokeWidth={18}
            />
            {ordered.map((segment, index) => (
              <circle
                key={segment.key}
                cx={60}
                cy={60}
                r={RING_RADIUS}
                fill="none"
                stroke={segment.color}
                strokeWidth={18}
                strokeDasharray={arcs[index].dasharray}
                strokeDashoffset={arcs[index].dashoffset}
                transform="rotate(-90 60 60)"
              />
            ))}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span
              className={cn(
                "text-[22px] leading-tight font-extrabold",
                total === 0 ? "text-[#C6C6D4]" : "text-[#1A1A2E]",
              )}
            >
              {total.toLocaleString()}
            </span>
            <span className="text-[12.5px] text-[#9A9AB0]">Students</span>
          </div>
        </div>

        <dl className="flex min-w-[170px] flex-1 flex-col gap-3.5">
          {segments.map((segment) => (
            <div
              key={segment.key}
              className="flex items-center gap-2.5 text-[13.5px]"
            >
              <span
                aria-hidden
                className="size-[9px] shrink-0 rounded-full"
                style={{ background: segment.color }}
              />
              <dt className="whitespace-nowrap text-[#333333]">
                {segment.label}
              </dt>
              <dd className="ml-auto font-bold whitespace-nowrap text-[#1A1A2E]">
                {segment.learners.toLocaleString()} ({segment.percent}%)
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Nothing to go and look at until somebody has enrolled. */}
      {total > 0 && (
        <Link
          to={`/course-listing/${courseId}?tab=students`}
          className="mt-[18px] flex items-center gap-1 text-[13.5px] font-bold text-[#1C5DD4] hover:underline"
        >
          View all students
          <ArrowRight size={13} strokeWidth={2.2} aria-hidden />
        </Link>
      )}
    </div>
  );
}
