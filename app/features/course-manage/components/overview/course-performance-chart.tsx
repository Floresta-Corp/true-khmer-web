import { ChevronDown } from "lucide-react";
import { MANAGE, type PerformancePoint } from "~/features/course-manage/types";
import {
  PERFORMANCE_BOX,
  buildSeries,
  buildTicks,
} from "../../lib/chart-geometry";
import { MANAGE_CARD } from "./course-kpi-cards";

/** Seven evenly spaced labels across the window, as the design shows. */
function pickLabels(points: PerformancePoint[], count = 7) {
  if (points.length <= count) return points.map((point) => point.label);
  const step = (points.length - 1) / (count - 1);
  return Array.from(
    { length: count },
    (_, index) => points[Math.round(index * step)].label,
  );
}

export function CoursePerformanceChart({ data }: { data: PerformancePoint[] }) {
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

  return (
    <div className={`${MANAGE_CARD} p-6`}>
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-bold text-[#1A1A2E]">
          Course performance
        </h3>
        {/* Static: there is no time-series endpoint to re-query. */}
        <span className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-3 py-[7px] text-[12.5px] font-semibold text-[#333333]">
          Last 30 days
          <ChevronDown size={12} strokeWidth={2.2} aria-hidden />
        </span>
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

      <div className="relative">
        <svg
          viewBox="0 0 700 240"
          width="100%"
          role="img"
          aria-label="Course performance over the last 30 days"
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
          <path d={enrolments.area} fill={MANAGE.brand} fillOpacity={0.08} />
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
          {enrolments.points.map((point) => (
            <circle
              key={`e-${point.x}`}
              cx={point.x}
              cy={point.y}
              r={4}
              fill={MANAGE.brand}
            />
          ))}
          {active.points.map((point) => (
            <circle
              key={`a-${point.x}`}
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
        {pickLabels(data).map((label) => (
          <span key={label} className="text-[11px] text-[#9A9AB0]">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
