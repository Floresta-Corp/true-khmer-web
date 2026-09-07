import { useMemo, useState } from "react";
import { ChevronDown, LineChart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import {
  MANAGE,
  PERFORMANCE_RANGES,
  type CourseTrends,
  type PerformancePoint,
  type PerformanceRange,
} from "~/features/course-manage/types";
import { buildPerformance } from "../../lib/manage-overview";
import {
  PERFORMANCE_BOX,
  buildSeries,
  buildTicks,
} from "../../lib/chart-geometry";
import { MANAGE_CARD } from "./course-kpi-cards";

/**
 * Seven evenly spaced labels across the window, as the design shows. Indices
 * come back with them, so the caller keys on position — a long window can
 * repeat a label like "Jul 20" across two years.
 */
function pickLabels(points: PerformancePoint[], count = 7) {
  if (points.length <= count)
    return points.map((point, index) => ({ index, label: point.label }));

  const step = (points.length - 1) / (count - 1);
  return Array.from({ length: count }, (_, slot) => {
    const index = Math.round(slot * step);
    return { index, label: points[index].label };
  });
}

export function CoursePerformanceChart({ trends }: { trends: CourseTrends }) {
  const [range, setRange] = useState<PerformanceRange>(30);

  const data = useMemo(() => buildPerformance(trends, range), [trends, range]);

  const activeRange =
    PERFORMANCE_RANGES.find((option) => option.days === range) ??
    PERFORMANCE_RANGES[1];

  const peak = Math.max(
    1,
    ...data.map((point) => Math.max(point.enrollments, point.activeStudents)),
  );
  const ticks = buildTicks(peak, 7, PERFORMANCE_BOX);
  const axisTop = ticks[0]?.value ?? peak;

  const enrolments = buildSeries(
    data.map((point) => point.enrollments),
    axisTop,
    PERFORMANCE_BOX,
  );
  const active = buildSeries(
    data.map((point) => point.activeStudents),
    axisTop,
    PERFORMANCE_BOX,
  );

  /* A single day cannot draw a line, so the dots carry it. */
  const showPoints = data.length > 1 && data.length <= 45;

  /* buildPerformance only comes back empty when the course has no trend data
     at all — never because the chosen window missed it — so hiding the range
     picker here cannot strand anyone in a window they can't leave. */
  const hasData = data.length > 0;

  return (
    <div className={`${MANAGE_CARD} flex flex-col p-6`}>
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-bold text-[#1A1A2E]">
          Course performance
        </h3>

        {hasData && (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-3 py-1.75 text-[12.5px] font-semibold text-[#333333] transition-colors hover:bg-[#F9FAFC]">
              {activeRange.label}
              <ChevronDown size={12} strokeWidth={2.2} aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-37.5 rounded-lg">
              {PERFORMANCE_RANGES.map((option) => (
                <DropdownMenuItem
                  key={option.days}
                  onSelect={() => setRange(option.days)}
                  className={cn(
                    "text-[13px]",
                    option.days === range && "font-bold text-[#1C5DD4]",
                  )}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="mt-2 mb-3.5 flex items-center gap-5">
        <span className="flex items-center gap-1.5 text-[13px] text-[#333333]">
          <span
            aria-hidden
            className="size-2 rounded-full"
            style={{ background: MANAGE.brand }}
          />
          Enrollments
        </span>
        <span className="flex items-center gap-1.5 text-[13px] text-[#333333]">
          <span
            aria-hidden
            className="size-2 rounded-full"
            style={{ background: MANAGE.accent }}
          />
          Active students
        </span>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-14 text-center">
          <span className="mb-3 flex size-11 items-center justify-center rounded-full bg-[#F1F1F4] text-[#9A9AB0]">
            <LineChart size={20} aria-hidden />
          </span>
          <p className="text-sm font-semibold text-[#1A1A2E]">
            No learner activity yet
          </p>
          <p className="mt-1.5 max-w-xs text-xs text-[#9A9AB0]">
            Enrolments and daily active students appear here once learners start
            opening lessons.
          </p>
        </div>
      ) : (
        <>
          <div className="relative">
            <svg
              viewBox="0 0 700 240"
              width="100%"
              role="img"
              aria-label={`Course performance, ${activeRange.label.toLowerCase()}`}
              className="block aspect-700/240 overflow-visible"
            >
              {ticks.map((tick) => (
                <path
                  key={tick.value}
                  d={tick.gridLine}
                  fill="none"
                  stroke={MANAGE.hairline}
                  strokeWidth={1}
                />
              ))}
              <path
                d={enrolments.area}
                fill={MANAGE.brand}
                fillOpacity={0.08}
              />
              <path
                d={enrolments.line}
                fill="none"
                stroke={MANAGE.brand}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={active.line}
                fill="none"
                stroke={MANAGE.accent}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {(showPoints || data.length === 1) &&
                enrolments.points.map((point, index) => (
                  <circle
                    key={`e-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r={4}
                    fill={MANAGE.brand}
                  />
                ))}
              {(showPoints || data.length === 1) &&
                active.points.map((point, index) => (
                  <circle
                    key={`a-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r={4}
                    fill={MANAGE.accent}
                  />
                ))}
            </svg>

            {ticks.map((tick) => (
              <span
                key={tick.value}
                className="absolute left-0 -translate-y-1/2 text-[11px] text-[#9A9AB0]"
                style={{ top: `${tick.topPct}%` }}
              >
                {tick.label}
              </span>
            ))}
          </div>

          <div className="mt-1.5 flex justify-between pl-9">
            {pickLabels(data).map((tick) => (
              <span key={tick.index} className="text-[11px] text-[#9A9AB0]">
                {tick.label}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
