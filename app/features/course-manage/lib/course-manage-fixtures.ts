import type { MyCourse } from "~/features/course-listing/types";
import {
  MANAGE,
  type CourseManageAnalytics,
  type CourseManageOverview,
  type FunnelStage,
  type ManageStudent,
  type PerformancePoint,
  type ProgressSegment,
  type QuizBand,
  type RatingBar,
  type ReviewStage,
  type TrendBar,
} from "~/features/course-manage/types";

/**
 * Placeholder analytics for the teach course-detail screen.
 *
 * Nothing on the API reports enrolments, progress, quiz results or reviews, so
 * these stand in. Figures are derived from the course id, so a course shows the
 * same numbers on every render instead of reshuffling. The design's own numbers
 * are reproduced for the first Course Listing placeholder (1,240 learners /
 * 64% / 71% / 4.7 — 794 + 372 + 74 = 1,240).
 */

const DESIGN_REFERENCE_ID = "11111111-1111-4111-8111-111111111111";

/** FNV-1a, so the same id always yields the same figures. */
function hash(value: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
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

function shortDate(date: Date) {
  return `${MONTHS[date.getMonth()]} ${String(date.getDate()).padStart(2, "0")}`;
}

/** "Mar" — the design's Enrollment trend is labelled by month. */
function monthLabel(date: Date) {
  return MONTHS[date.getMonth()];
}

/** "02 Mar 2026" — padded, and read in UTC for the same reason as the table. */
function longDate(date: Date) {
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${day} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** 30 daily points ending today, ramping up to the current totals. */
function buildPerformance(
  seed: number,
  enrollments: number,
  activeStudents: number,
): PerformancePoint[] {
  const days = 30;
  const today = new Date();

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - 1 - index));

    // Ease-out so growth is fast early and flattens, as in the design.
    const t = (index + 1) / days;
    const eased = 1 - Math.pow(1 - t, 1.7);
    const wobble = (((seed >>> (index % 24)) & 0x1f) - 15) / 1000;

    return {
      label: shortDate(date),
      enrollments: Math.max(
        0,
        Math.round(enrollments * (0.45 + 0.55 * eased) * (1 + wobble)),
      ),
      activeStudents: Math.max(
        0,
        Math.round(activeStudents * (0.38 + 0.62 * eased) * (1 + wobble)),
      ),
    };
  });
}

function segments(
  total: number,
  completedPercent: number,
  inProgressPercent: number,
): ProgressSegment[] {
  const notStartedPercent = 100 - completedPercent - inProgressPercent;
  const learners = (percent: number) => Math.round((total * percent) / 100);

  return [
    {
      key: "notStarted",
      label: "Not started",
      learners: learners(notStartedPercent),
      percent: notStartedPercent,
      color: MANAGE.primary100,
    },
    {
      key: "inProgress",
      label: "In progress",
      learners: learners(inProgressPercent),
      percent: inProgressPercent,
      color: MANAGE.accent,
    },
    {
      key: "completed",
      label: "Completed",
      learners: learners(completedPercent),
      percent: completedPercent,
      color: MANAGE.success,
    },
  ];
}

export function buildManageOverview(course: MyCourse): CourseManageOverview {
  const seed = hash(course.id);
  const isReference = course.id === DESIGN_REFERENCE_ID;

  const enrollments = isReference ? 1240 : 120 + (seed % 2400);
  const completionRate = isReference ? 64 : 35 + (seed % 45);
  const inProgressPercent = isReference
    ? 30
    : Math.min(100 - completionRate, 10 + ((seed >>> 8) % 35));

  return {
    enrollments,
    completionRate,
    lessonCount: isReference ? 15 : 6 + (seed % 18),
    quizPassRate: isReference ? 71 : 55 + ((seed >>> 4) % 40),
    avgQuizScore: isReference ? 78 : 60 + ((seed >>> 12) % 35),
    rating: isReference
      ? 4.7
      : Number((3.9 + ((seed >>> 16) % 11) / 10).toFixed(1)),
    reviewCount: isReference ? 184 : 12 + ((seed >>> 20) % 260),
    totalLearners: enrollments,
    progress: segments(enrollments, completionRate, inProgressPercent),
    performance: buildPerformance(
      seed,
      enrollments,
      Math.round(enrollments * 0.82),
    ),
  };
}

/* ------------------------------ Students --------------------------------- */

const STUDENT_NAMES: readonly (readonly [string, string | null])[] = [
  ["Bopha Chea", "/images/education/instructors/bopha-chea.jpg"],
  ["Kosal Em", "/images/education/instructors/kosal-em.jpg"],
  ["Phalla Sok", "/images/education/instructors/phalla-sok.jpg"],
  ["Sreymom Ly", "/images/education/instructors/sreymom-ly.jpg"],
  ["Vichea Chhun", "/images/education/instructors/vichea-chhun.jpg"],
  ["Dara Nou", null],
  ["Rithy Sok", null],
  ["Chantha Meas", null],
  ["Sophea Kim", null],
  ["Vuthy Prak", null],
];

/**
 * The five learners the design lists for its reference course.
 *
 * Two of them have no photo of their own in `public/images/education/
 * instructors`, so they reuse a spare one — the design does the same, filling
 * every row from the same small set of stock portraits.
 */
const REFERENCE_STUDENTS: ReadonlyArray<
  Omit<ManageStudent, "id"> & { enrolledAt: string }
> = [
  {
    name: "Sreymom Ly",
    avatarUrl: "/images/education/instructors/sreymom-ly.jpg",
    enrolledAt: "2026-03-02T00:00:00.000Z",
    progressPercent: 100,
    status: "completed",
    quizScore: "92%",
    completedLabel: "28 Apr 2026",
  },
  {
    name: "Pisey Kong",
    avatarUrl: "/images/education/instructors/phalla-sok.jpg",
    enrolledAt: "2026-03-11T00:00:00.000Z",
    progressPercent: 80,
    status: "in-progress",
    quizScore: "76%",
    completedLabel: "–",
  },
  {
    name: "Kosal Em",
    avatarUrl: "/images/education/instructors/kosal-em.jpg",
    enrolledAt: "2026-03-19T00:00:00.000Z",
    progressPercent: 100,
    status: "completed",
    quizScore: "88%",
    completedLabel: "02 May 2026",
  },
  {
    name: "Bopha Chea",
    avatarUrl: "/images/education/instructors/bopha-chea.jpg",
    enrolledAt: "2026-04-04T00:00:00.000Z",
    progressPercent: 47,
    status: "in-progress",
    quizScore: "52%",
    completedLabel: "–",
  },
  {
    name: "Sovann Rith",
    avatarUrl: "/images/education/instructors/vichea-chhun.jpg",
    enrolledAt: "2026-04-22T00:00:00.000Z",
    progressPercent: 20,
    status: "in-progress",
    quizScore: "34%",
    completedLabel: "–",
  },
];

/**
 * A page of learners. The status mix follows the Overview split, so a course
 * showing 64% completed lists mostly completed learners.
 */
export function buildStudents(
  course: MyCourse,
  overview: CourseManageOverview,
): ManageStudent[] {
  if (course.id === DESIGN_REFERENCE_ID) {
    return REFERENCE_STUDENTS.map((student, index) => ({
      ...student,
      id: `${course.id}-st${index + 1}`,
    }));
  }

  const seed = hash(course.id);
  const completedShare =
    overview.progress.find((s) => s.key === "completed")?.percent ?? 0;
  const inProgressShare =
    overview.progress.find((s) => s.key === "inProgress")?.percent ?? 0;

  return STUDENT_NAMES.map(([name, avatarUrl], index) => {
    // Deterministic 0–99 per row, bucketed by the same percentages.
    const roll = ((seed >>> (index % 20)) + index * 37) % 100;

    const status: ManageStudent["status"] =
      roll < completedShare
        ? "completed"
        : roll < completedShare + inProgressShare
          ? "in-progress"
          : "not-started";

    const enrolled = new Date("2026-07-01T00:00:00.000Z");
    enrolled.setDate(enrolled.getDate() + (roll % 45));

    const completed = new Date(enrolled);
    completed.setDate(enrolled.getDate() + 12 + (roll % 20));

    return {
      id: `${course.id}-st${index + 1}`,
      name,
      avatarUrl,
      enrolledAt: enrolled.toISOString(),
      progressPercent:
        status === "completed"
          ? 100
          : status === "not-started"
            ? 0
            : 15 + (roll % 70),
      status,
      // A learner who has started has sat the quiz; one who has not, has not.
      quizScore: status === "not-started" ? "–" : `${45 + (roll % 50)}%`,
      completedLabel: status === "completed" ? longDate(completed) : "–",
    };
  });
}

/* ------------------------------- Review ---------------------------------- */

/**
 * The submission pipeline shown at the top of the Review tab. Which stage is
 * current follows the course's own status, and a rejected course carries the
 * note the API returns.
 */
export function buildReviewStages(course: MyCourse): ReviewStage[] {
  const rejected = Boolean(course.rejectedAt);
  // Unpublishing does not undo the approval, so both count as approved.
  const approved =
    course.status === "PUBLISHED" || course.status === "UNPUBLISHED";
  const pending = course.status === "PENDING";
  const live = course.status === "PUBLISHED";
  // A draft that has never been sent has not entered the pipeline at all.
  const submitted = pending || approved || rejected;

  const decided = course.rejectedAt
    ? longDate(new Date(course.rejectedAt))
    : course.publishedAt
      ? longDate(new Date(course.publishedAt))
      : "";

  return [
    {
      title: "Submitted",
      timestamp: submitted ? longDate(new Date(course.createdAt)) : "",
      state: submitted ? "done" : "todo",
    },
    {
      title: "In review",
      timestamp: pending ? "In progress" : decided,
      state: pending ? "current" : approved || rejected ? "done" : "todo",
    },
    {
      title: rejected ? "Not approved" : "Approved",
      timestamp: approved || rejected ? decided : "",
      state: rejected ? "rejected" : approved ? "done" : "todo",
    },
    {
      title: "Published",
      timestamp: live ? decided : "",
      state: live ? "done" : "todo",
    },
  ];
}

/** The histogram the design's Review distribution card plots, 5★ first. */
const REFERENCE_RATING_COUNTS = [110, 52, 15, 5, 2] as const;

/**
 * A 5→1 histogram that sums to `reviewCount` and averages towards `rating`, so
 * the bars agree with the headline figure instead of contradicting it.
 *
 * Percentages carry one decimal because the design shows them that way
 * ("110 (59.8%)"), and rounding to whole numbers would not add up to 100.
 */
export function buildRatingBreakdown(
  course: MyCourse,
  rating: number,
  reviewCount: number,
): RatingBar[] {
  let counts: number[];

  if (course.id === DESIGN_REFERENCE_ID) {
    counts = [...REFERENCE_RATING_COUNTS];
  } else {
    // No floor on the weights: one would lift the far tail above its
    // neighbour, and the histogram has to fall away from `rating` on both
    // sides to read as a rating distribution.
    const weights = [5, 4, 3, 2, 1].map((stars) =>
      Math.exp(-Math.abs(stars - rating) * 1.6),
    );
    const sum = weights.reduce((total, weight) => total + weight, 0);
    counts = weights.map((weight) => Math.round((weight / sum) * reviewCount));

    // Give any rounding remainder to the largest bucket so the total is exact.
    const drift = reviewCount - counts.reduce((total, n) => total + n, 0);
    counts[counts.indexOf(Math.max(...counts))] += drift;
  }

  return [5, 4, 3, 2, 1].map((stars, index) => ({
    stars,
    count: counts[index],
    percent:
      reviewCount === 0
        ? 0
        : Math.round((counts[index] / reviewCount) * 1000) / 10,
  }));
}

/* ------------------------------ Analytics -------------------------------- */

/**
 * Bands run strongest-first, the order the design lists them in, so the donut
 * fills clockwise from twelve o'clock with the largest cohort leading.
 */
const QUIZ_BANDS: readonly (readonly [string, string, number])[] = [
  ["90-100%", MANAGE.brand, 0.27],
  ["70-89%", MANAGE.success, 0.46],
  ["50-69%", MANAGE.amber, 0.2],
  ["Below 50%", MANAGE.error, 0.07],
];

/** Enrolments per month for the design's reference course. */
const REFERENCE_TREND = [134, 100, 72, 50, 38, 34] as const;

const TREND_MONTHS = 6;

/**
 * The four Analytics cards. The funnel narrows monotonically from enrolments to
 * completions, and the quiz bands sum to the number of attempts.
 */
export function buildAnalytics(
  course: MyCourse,
  overview: CourseManageOverview,
): CourseManageAnalytics {
  const seed = hash(course.id);
  const isReference = course.id === DESIGN_REFERENCE_ID;
  const total = overview.enrollments;

  // Monthly buckets ending this month, decaying from a launch spike — the
  // shape the design plots, where the earliest month is the tallest bar.
  const peak = Math.max(1, Math.round(total * 0.11));
  const trend: TrendBar[] = Array.from({ length: TREND_MONTHS }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (TREND_MONTHS - 1 - index));
    const wobble = (((seed >>> (index * 3)) & 0x1f) - 15) / 200;
    return {
      label: monthLabel(date),
      value: isReference
        ? REFERENCE_TREND[index]
        : Math.max(1, Math.round(peak * Math.pow(0.72, index) * (1 + wobble))),
    };
  });

  const started = Math.round(total * 0.94);
  const completed =
    overview.progress.find((s) => s.key === "completed")?.learners ?? 0;

  // Everyone who started and has not finished is still working through it, so
  // the last two stages add back up to `started`.
  const stages: readonly (readonly [string, number, string])[] = [
    ["Enrolled", total, MANAGE.brand],
    ["Started", started, MANAGE.brandLight],
    ["Completed", completed, MANAGE.success],
    ["In progress", Math.max(0, started - completed), MANAGE.amber],
  ];

  // Sorted by size, because a funnel has to narrow to read as one. The design's
  // own figures already fall in the order above, so its reference course renders
  // exactly as drawn; sorting only matters for a course whose completions are
  // outnumbered by its in-progress learners, which would otherwise widen the
  // silhouette at the bottom.
  const funnel: FunnelStage[] = stages
    .map(([label, learners, color]) => ({
      label,
      learners,
      percent: total === 0 ? 0 : Math.round((learners / total) * 100),
      color,
      fillOpacity: 1,
    }))
    .sort((a, b) => b.learners - a.learners);

  // Attempts, not enrolments: only learners who reached the quiz have a score.
  const quizAttempts = started;
  const quizBands: QuizBand[] = QUIZ_BANDS.map(([label, color, share]) => ({
    label,
    learners: Math.round(quizAttempts * share),
    percent: Math.round(share * 100),
    color,
  }));

  return { trend, funnel, quizBands, quizAttempts };
}
