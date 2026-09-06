import { z } from "zod";
import type { MyCourse } from "~/features/course-listing/types";
import type { CourseReview, CourseSection } from "~/features/education/types";

/**
 * Palette for the teach course-detail screen, taken from the design system
 * tokens plus the `--tk-brand-primary` override in the design document.
 *
 * Note: the screenshot circulated earlier renders a more indigo palette
 * (#3244CB / #4695FC) than these tokens produce. These values follow the
 * current markup in `scraps/teachBlock.txt`; change them here to switch.
 */
export const MANAGE = {
  brand: "#1C5DD4", // --tk-brand-primary (document override)
  accent: "#32A8FF", // --tk-accent-500
  primary100: "#D5E2FA",
  primary50: "#EFF4FE",
  heading: "#1A1A2E", // --tk-text-heading
  body: "#333333", // --tk-text-body / neutral-1000
  muted: "#9A9AB0", // --tk-text-muted
  hairline: "#E5E7EB", // --tk-border-default
  neutral200: "#E8E8E8",
  neutral700: "#777777",
  neutral900: "#4A4A4A",
  success: "#1FC16B",
  warning: "#E17100",
  error: "#FB3748",
  /* The funnel and the review bars use two hues the token file does not name.
     Both are sampled from the design's Analytics tab. */
  brandLight: "#93B4EE",
  amber: "#FBBF24",
} as const;

export const MANAGE_TABS = [
  "overview",
  "content",
  "students",
  "analytics",
  "review",
] as const;

export type ManageTab = (typeof MANAGE_TABS)[number];

export const ManageTabSchema = z.enum(MANAGE_TABS);

export const MANAGE_TAB_LABELS: Record<ManageTab, string> = {
  overview: "Overview",
  content: "Content",
  students: "Students",
  analytics: "Analytics",
  review: "Review",
};

/* ----------------------------- Overview ---------------------------------- */

/** One point on the Course performance chart. */
export interface PerformancePoint {
  label: string;
  enrollments: number;
  activeStudents: number;
}

/**
 * The raw daily series the chart windows client-side. Held un-aggregated so
 * changing the range costs no refetch.
 */
export interface CourseTrends {
  enrollment: { date: string; learners: number }[];
  activity: { date: string; learners: number }[];
}

/** Windows the Course performance chart offers. `0` days means all time. */
export const PERFORMANCE_RANGES = [
  { days: 7, label: "Last 7 days" },
  { days: 30, label: "Last 30 days" },
  { days: 90, label: "Last 90 days" },
  { days: 0, label: "All time" },
] as const;

export type PerformanceRange = (typeof PERFORMANCE_RANGES)[number]["days"];

export interface ProgressSegment {
  key: "notStarted" | "inProgress" | "completed";
  label: string;
  learners: number;
  percent: number;
  color: string;
}

/**
 * Everything the Overview tab shows.
 *
 * Enrolments, completion and the progress split come from `GET
 * /courses/{id}/stats`. The four nullable fields do not: nothing records quiz
 * attempts or ratings, and `null` says "not tracked" where `0` would read as a
 * course whose learners all failed and nobody liked.
 */
export interface CourseManageOverview {
  enrollments: number;
  completionRate: number;
  lessonCount: number;
  quizPassRate: number | null;
  avgQuizScore: number | null;
  rating: number | null;
  reviewCount: number;
  totalLearners: number;
  progress: ProgressSegment[];
}

/* ----------------------------- Students ---------------------------------- */

export const STUDENT_FILTERS = [
  "all",
  "completed",
  "in-progress",
  "not-started",
] as const;

export type StudentFilter = (typeof STUDENT_FILTERS)[number];

export const STUDENT_FILTER_LABELS: Record<StudentFilter, string> = {
  all: "All",
  completed: "Completed",
  "in-progress": "In progress",
  "not-started": "Not started",
};

/**
 * Rows per page in the Students tab.
 *
 * Lives here rather than beside the loader that uses it: the tab and the page
 * component both need it, and importing it from a `.server`-adjacent module
 * dragged `education.server.ts` into the client bundle.
 */
export const STUDENT_PAGE_SIZE = 20;

export interface ManageStudent {
  id: string;
  name: string;
  avatarUrl: string | null;
  /** ISO date. */
  enrolledAt: string;
  progressPercent: number;
  status: Exclude<StudentFilter, "all">;
  /** e.g. "82%", or "—" when they have not sat the quiz. */
  quizScore: string;
  /** Completion date, or "—". */
  completedLabel: string;
}

export const STUDENT_STATUS_LABELS: Record<ManageStudent["status"], string> = {
  completed: "Completed",
  "in-progress": "In progress",
  "not-started": "Not started",
};

/* ------------------------------ Review ----------------------------------- */

export type ReviewStageState = "done" | "current" | "rejected" | "todo";

export interface ReviewStage {
  title: string;
  timestamp: string;
  state: ReviewStageState;
}

export interface RatingBar {
  stars: number;
  count: number;
  percent: number;
}

/* ----------------------------- Analytics --------------------------------- */

export interface TrendBar {
  label: string;
  value: number;
}

export interface FunnelStage {
  label: string;
  learners: number;
  percent: number;
  color: string;
  fillOpacity: number;
}

export interface QuizBand {
  label: string;
  learners: number;
  percent: number;
  color: string;
}

export interface CourseManageAnalytics {
  trend: TrendBar[];
  funnel: FunnelStage[];
  quizBands: QuizBand[];
  /** Attempt count shown in the donut's centre. */
  quizAttempts: number;
}

/* ------------------------------------------------------------------------- */

export interface CourseManageData {
  course: MyCourse;
  overview: CourseManageOverview;
  curriculum: CourseSection[];
  students: ManageStudent[];
  reviews: CourseReview[];
  ratingBreakdown: RatingBar[];
  reviewStages: ReviewStage[];
  analytics: CourseManageAnalytics;
}
