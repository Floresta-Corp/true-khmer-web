import type {
  CourseStatsResponse,
  CourseTrendPoint,
} from "~/api/education/education.server";
import {
  MANAGE,
  type CourseManageAnalytics,
  type CourseManageOverview,
  type CourseTrends,
  type FunnelStage,
  type ManageStudent,
  type PerformancePoint,
  type ProgressSegment,
  type RatingBar,
} from "~/features/course-manage/types";

type Stats = CourseStatsResponse["stats"];

const EMPTY_STATS: Stats = {
  lessonCount: 0,
  progress: { total: 0, notStarted: 0, inProgress: 0, completed: 0 },
  enrollmentTrend: [],
  activityTrend: [],
  quiz: { attempts: 0, passRate: null, averageScore: null, bands: [] },
  rating: { average: null, total: 0, breakdown: [0, 0, 0, 0, 0] },
};

function percent(part: number, total: number) {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function shortDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${day} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/**
 * The three buckets, straight off the server's aggregate.
 *
 * Derived in SQL rather than here: the roster is paged now, so counting it
 * client-side would only ever count the page in hand.
 */
function split(stats: Stats) {
  return stats.progress;
}

function progressSegments(stats: Stats): ProgressSegment[] {
  const { total, completed, inProgress, notStarted } = split(stats);
  return [
    {
      key: "notStarted",
      label: "Not started",
      learners: notStarted,
      percent: percent(notStarted, total),
      color: MANAGE.primary100,
    },
    {
      key: "inProgress",
      label: "In progress",
      learners: inProgress,
      percent: percent(inProgress, total),
      color: MANAGE.accent,
    },
    {
      key: "completed",
      label: "Completed",
      learners: completed,
      percent: percent(completed, total),
      color: MANAGE.success,
    },
  ];
}

export function buildManageOverview(stats: Stats | null): CourseManageOverview {
  const source = stats ?? EMPTY_STATS;
  const { total, completed } = split(source);

  return {
    lessonCount: source.lessonCount,
    enrollments: total,
    totalLearners: total,
    completionRate: percent(completed, total),
    progress: progressSegments(source),
    /* Null passes straight through from the API: it means nobody has sat the
       quiz or left a review, which "0%" and "0.0" would misreport as a course
       whose learners all failed and nobody liked. */
    quizPassRate: source.quiz.passRate,
    avgQuizScore: source.quiz.averageScore,
    rating: source.rating.average,
    reviewCount: source.rating.total,
  };
}

/* ---------------------------- Performance -------------------------------- */

const DAY_MS = 86_400_000;

/** `YYYY-MM-DD` for a UTC day, matching what the API's `::date` casts return. */
function dayKey(time: number) {
  return new Date(time).toISOString().slice(0, 10);
}

/** "Jul 20", as the chart's x-axis writes it. */
function dayLabel(time: number) {
  const date = new Date(time);
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}`;
}

function toMap(points: CourseTrendPoint[]) {
  return new Map(points.map((point) => [point.date, point.learners]));
}

export function buildTrends(stats: Stats | null): CourseTrends {
  const source = stats ?? EMPTY_STATS;
  return {
    enrollment: source.enrollmentTrend,
    activity: source.activityTrend,
  };
}

/**
 * A gap-free daily series for the chart's two lines.
 *
 * `enrollments` is cumulative — learners who had started by that day, seeded
 * with everyone who started before the window opened, so the line continues
 * from its real height rather than restarting at zero. `activeStudents` is the
 * count for that day alone. Days with no rows are emitted as zero, so a quiet
 * stretch reads as flat rather than being compressed away.
 *
 * `days` of 0 means all time, anchored on the first day that has any data.
 */
export function buildPerformance(
  trends: CourseTrends,
  days: number,
): PerformancePoint[] {
  const started = toMap(trends.enrollment);
  const active = toMap(trends.activity);

  const dated = [...started.keys(), ...active.keys()].sort();
  if (dated.length === 0) return [];

  const today = Date.parse(`${dayKey(Date.now())}T00:00:00Z`);
  const firstDated = Date.parse(`${dated[0]}T00:00:00Z`);
  const lastDated = Date.parse(`${dated[dated.length - 1]}T00:00:00Z`);

  /* All time runs to the last day with data; a fixed window runs to today, so
     "Last 30 days" means the last 30 days and not the last 30 with activity. */
  const end = days === 0 ? lastDated : Math.max(today, firstDated);
  const start =
    days === 0 ? firstDated : Math.max(firstDated, end - (days - 1) * DAY_MS);

  let running = 0;
  for (const [date, learners] of started) {
    if (Date.parse(`${date}T00:00:00Z`) < start) running += learners;
  }

  const points: PerformancePoint[] = [];
  for (let time = start; time <= end; time += DAY_MS) {
    const key = dayKey(time);
    running += started.get(key) ?? 0;
    points.push({
      label: dayLabel(time),
      enrollments: running,
      activeStudents: active.get(key) ?? 0,
    });
  }

  return points;
}

/** Five bars, five stars first, as the Analytics breakdown reads them. */
export function buildRatingBreakdown(stats: Stats | null): RatingBar[] {
  const source = stats ?? EMPTY_STATS;
  const { breakdown, total } = source.rating;

  return [5, 4, 3, 2, 1].map((stars) => {
    const count = breakdown[stars - 1] ?? 0;
    return { stars, count, percent: percent(count, total) };
  });
}

/* ------------------------------ Analytics -------------------------------- */

export function buildAnalytics(stats: Stats | null): CourseManageAnalytics {
  const source = stats ?? EMPTY_STATS;
  const { total, completed, inProgress } = split(source);

  const funnel: FunnelStage[] =
    total === 0
      ? []
      : (
          [
            { label: "Started", learners: total, color: MANAGE.brand },
            {
              label: "In progress",
              learners: inProgress,
              color: MANAGE.warning,
            },
            { label: "Completed", learners: completed, color: MANAGE.success },
          ] as const
        ).map((stage, index) => ({
          label: stage.label,
          learners: stage.learners,
          percent: percent(stage.learners, total),
          color: stage.color,
          fillOpacity: 1 - index * 0.1,
        }));

  const bandColors = [
    MANAGE.error,
    MANAGE.warning,
    MANAGE.accent,
    MANAGE.success,
  ];

  return {
    trend: source.enrollmentTrend.map((point) => ({
      label: shortDate(point.date),
      value: point.learners,
    })),
    funnel,
    quizBands: source.quiz.bands.map((band, index) => ({
      label: band.label,
      learners: band.attempts,
      percent: percent(band.attempts, source.quiz.attempts),
      color: bandColors[index] ?? MANAGE.brandLight,
    })),
    quizAttempts: source.quiz.attempts,
  };
}
