import { Calendar, ChevronDown, Star } from "lucide-react";
import {
  MANAGE,
  type CourseManageAnalytics,
} from "~/features/course-manage/types";
import type { RatingBar } from "~/features/course-manage/types";
import {
  RING_RADIUS,
  TREND_BOX,
  buildBars,
  buildFunnelPolygons,
  buildRingArcs,
  buildTicks,
  funnelViewHeight,
} from "../../lib/chart-geometry";
import { MANAGE_CARD } from "../overview/course-kpi-cards";
import { CardInfo } from "./analytics-info";

interface AnalyticsTabProps {
  analytics: CourseManageAnalytics;
  ratingBreakdown: RatingBar[];
  rating: number;
  reviewCount: number;
}

/** The design hides the breakdown until there are enough ratings to shape it. */
const SPARSE_REVIEW_THRESHOLD = 5;

export function AnalyticsTab({
  analytics,
  ratingBreakdown,
  rating,
  reviewCount,
}: AnalyticsTabProps) {
  const { trend, funnel, quizBands, quizAttempts } = analytics;

  const trendPeak = Math.max(1, ...trend.map((bar) => bar.value));
  const trendTicks = buildTicks(trendPeak, 6, TREND_BOX);
  const bars = buildBars(trend, trendTicks[0]?.value ?? trendPeak, TREND_BOX);

  const polygons = buildFunnelPolygons(funnel.map((stage) => stage.percent));
  const funnelHeight = funnelViewHeight(funnel.length);

  const quizArcs = buildRingArcs(quizBands.map((band) => band.learners));

  /* `buildAnalytics` returns an empty funnel at zero learners, so this tests
     the length — `funnel[0]?.learners === 0` was comparing undefined to 0 and
     never firing. */
  if (funnel.length === 0) {
    return (
      <div className="rounded-xl bg-white px-6 py-10 text-center">
        <p className="text-sm font-semibold text-[#1A1A2E]">
          No enrollments yet
        </p>
        <p className="mt-1.5 text-xs text-[#9A9AB0]">
          Analytics will be available once this course is published.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {/* Enrollment trend */}
      <div className={`${MANAGE_CARD} min-w-0 p-6`}>
        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-bold text-[#1A1A2E]">
              Enrollment trend
            </h3>
            <CardInfo text="New enrolments per month over the selected window." />
          </div>
          {/* Static: there is no time-series endpoint to re-query. */}
          <span className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-3 py-[7px] text-[12.5px] font-semibold text-[#333333]">
            <Calendar size={14} strokeWidth={2} aria-hidden />
            Last 6 months
            <ChevronDown size={12} strokeWidth={2.2} aria-hidden />
          </span>
        </div>

        <div className="relative mt-2.5">
          <svg
            viewBox="0 0 400 170"
            width="100%"
            role="img"
            aria-label="Enrolments per month"
            className="block aspect-400/170 overflow-visible"
          >
            {trendTicks.map((tick) => (
              <path
                key={tick.value}
                d={tick.gridLine}
                fill="none"
                stroke={MANAGE.hairline}
                strokeWidth={1}
              />
            ))}
            {bars.map((bar) => (
              <path key={bar.label} d={bar.path} fill={MANAGE.brand} />
            ))}
          </svg>

          {trendTicks.map((tick) => (
            <span
              key={tick.value}
              className="absolute left-0 -translate-y-1/2 text-[11px] text-[#9A9AB0]"
              style={{ top: `${tick.topPct}%` }}
            >
              {tick.label}
            </span>
          ))}
        </div>

        <div className="mt-0.5 flex justify-between pl-[34px]">
          {bars.map((bar) => (
            <span
              key={bar.label}
              className="flex-1 text-center text-[11px] text-[#9A9AB0]"
            >
              {bar.label}
            </span>
          ))}
        </div>
      </div>

      {/* Course completion funnel */}
      <div className={`${MANAGE_CARD} flex min-w-0 flex-col p-6`}>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h3 className="shrink-0 text-base font-bold whitespace-nowrap text-[#1A1A2E]">
            Course Completion funnel
          </h3>
          <CardInfo text="How many learners reach each stage of the course." />
          <span className="ml-auto text-[13px] text-[#9A9AB0]">Students</span>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <div className="flex flex-wrap items-center gap-8">
            <svg
              viewBox={`0 0 400 ${funnelHeight}`}
              width={220}
              role="img"
              aria-label="Enrolled to completed funnel"
              className="shrink-0"
            >
              {funnel.map((stage, index) => (
                <polygon
                  key={stage.label}
                  points={polygons[index]}
                  fill={stage.color}
                  fillOpacity={stage.fillOpacity}
                />
              ))}
            </svg>

            <dl className="flex min-w-[180px] flex-1 flex-col gap-4">
              {funnel.map((stage) => (
                <div
                  key={stage.label}
                  className="flex items-center gap-2.5 text-sm"
                >
                  <span
                    aria-hidden
                    className="size-2.5 shrink-0 rounded-[3px]"
                    style={{ background: stage.color }}
                  />
                  <dt className="text-[#333333]">{stage.label}</dt>
                  <dd className="ml-auto font-bold text-[#1A1A2E]">
                    {stage.learners.toLocaleString()} ({stage.percent}%)
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Quiz score distribution */}
      <div className={`${MANAGE_CARD} min-w-0 p-6`}>
        <div className="mb-[18px] flex flex-wrap items-center gap-2">
          <h3 className="shrink-0 text-base font-bold whitespace-nowrap text-[#1A1A2E]">
            Quiz score distribution
          </h3>
          <CardInfo text="Final quiz scores across everyone who has sat it." />
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="relative size-[200px] shrink-0">
            <svg
              viewBox="0 0 120 120"
              width={200}
              height={200}
              role="img"
              aria-label="Quiz scores by band"
            >
              {quizBands.map((band, index) => (
                <circle
                  key={band.label}
                  cx={60}
                  cy={60}
                  r={RING_RADIUS}
                  fill="none"
                  stroke={band.color}
                  strokeWidth={18}
                  strokeDasharray={quizArcs[index].dasharray}
                  strokeDashoffset={quizArcs[index].dashoffset}
                  transform="rotate(-90 60 60)"
                />
              ))}
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl leading-tight font-extrabold text-[#1A1A2E]">
                {quizAttempts.toLocaleString()}
              </span>
              <span className="text-[12.5px] text-[#9A9AB0]">
                total attempts
              </span>
            </div>
          </div>

          <dl className="flex min-w-[180px] flex-1 flex-col gap-4">
            <div className="flex items-center">
              <span className="text-[11px] font-semibold text-[#9A9AB0]">
                Quiz score
              </span>
              <span className="ml-auto text-[11px] font-semibold text-[#9A9AB0]">
                Students
              </span>
            </div>
            {quizBands.map((band) => (
              <div
                key={band.label}
                className="flex items-center gap-2.5 text-sm text-[#333333]"
              >
                <span
                  aria-hidden
                  className="size-2.5 shrink-0 rounded-[3px]"
                  style={{ background: band.color }}
                />
                <dt>{band.label}</dt>
                <dd className="ml-auto font-bold text-[#1A1A2E]">
                  {band.percent}%
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Review distribution */}
      {reviewCount >= SPARSE_REVIEW_THRESHOLD ? (
        <div className={`${MANAGE_CARD} min-w-0 p-6`}>
          <div className="mb-7 flex flex-wrap items-center gap-2">
            <h3 className="shrink-0 text-base font-bold whitespace-nowrap text-[#1A1A2E]">
              Review distribution
            </h3>
            <CardInfo text="How learners have rated this course, by star." />
            <span className="ml-auto flex items-center gap-1.5 text-[13px] text-[#9A9AB0]">
              <Star
                size={14}
                aria-hidden
                className="fill-amber-400 text-amber-400"
              />
              {rating.toFixed(1)} · {reviewCount} reviews
            </span>
          </div>

          <div
            role="img"
            aria-label="Review counts by star rating"
            className="mt-1.5 flex flex-col gap-5"
          >
            {ratingBreakdown.map((bar) => (
              <div key={bar.stars} className="flex items-center gap-5">
                <span className="w-7 shrink-0 text-left text-[13px] text-[#9A9AB0]">
                  {bar.stars} ★
                </span>
                <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#E8E8E8]">
                  <span
                    className="block h-full rounded-full"
                    style={{
                      background: MANAGE.amber,
                      width: `${bar.percent}%`,
                    }}
                  />
                </span>
                <span className="w-[88px] shrink-0 text-right text-[13px] font-bold text-[#1A1A2E]">
                  {bar.count} ({bar.percent}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className={`${MANAGE_CARD} flex min-w-0 flex-col items-center justify-center p-6 text-center`}
        >
          <h3 className="mb-2 text-base font-bold text-[#1A1A2E]">
            Review distribution
          </h3>
          <p className="text-xs text-[#9A9AB0]">
            Not enough reviews yet to show a breakdown.
          </p>
        </div>
      )}
    </div>
  );
}
