import { z } from "zod";

/**
 * Statuses the admin course list can filter on. DRAFT is deliberately absent —
 * the API only accepts these three, since an unsubmitted draft is not the
 * moderation team's business.
 */
export const adminCourseStatusFilterSchema = z.enum([
  "PENDING",
  "PUBLISHED",
  "UNPUBLISHED",
]);
export type AdminCourseStatusFilter = z.infer<
  typeof adminCourseStatusFilterSchema
>;

export const courseSortBySchema = z.enum(["newest", "oldest"]);
export type CourseSortBy = z.infer<typeof courseSortBySchema>;

export const ALL_STATUSES = "all-statuses";
export const DEFAULT_SORT_BY: CourseSortBy = "newest";

export const COURSE_STATUS_OPTIONS: {
  value: AdminCourseStatusFilter;
  label: string;
}[] = [
  { value: "PENDING", label: "In review" },
  { value: "PUBLISHED", label: "Published" },
  { value: "UNPUBLISHED", label: "Unpublished" },
];

export const COURSE_SORT_OPTIONS: { value: CourseSortBy; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

/** URL params carry lowercase statuses; the API wants them uppercase. */
export function toStatusParam(status: AdminCourseStatusFilter) {
  return status.toLowerCase();
}

export function fromStatusParam(value: string | null) {
  return value ? value.toUpperCase() : undefined;
}

export const COURSE_REVIEW_INTENTS = [
  "approveCourse",
  "rejectCourse",
  "publishCourse",
  "unpublishCourse",
] as const;

export type CourseReviewIntent = (typeof COURSE_REVIEW_INTENTS)[number];

export function isCourseReviewIntent(
  value: string,
): value is CourseReviewIntent {
  return (COURSE_REVIEW_INTENTS as readonly string[]).includes(value);
}

export const REJECTION_NOTE_MAX_LENGTH = 2000;

/* --------------------- Submitted content, for review ---------------------- */

/**
 * Shapes the admin course endpoint returns alongside the course once the API
 * carries a curriculum. Declared here rather than imported from the generated
 * client so the screen still builds against an API that predates them.
 */
export type ReviewLesson = {
  id: string;
  title: string;
  type: "YOUTUBE" | "PDF" | "AUDIO";
  url: string | null;
  assetUrl: string | null;
  durationSeconds: number | null;
  isPreview: boolean;
};

export type ReviewChapter = {
  id: string;
  title: string;
  lessons: ReviewLesson[];
};

export type ReviewCurriculum = {
  format: "MULTI" | "SINGLE";
  chapters: ReviewChapter[];
  lessonCount: number;
};

export type ReviewQuizQuestion = {
  id: string;
  question: string;
  options: { id: string; label: string; isCorrect: boolean }[];
};

export type ReviewQuiz = {
  passMark: number;
  questions: ReviewQuizQuestion[];
};

export type CourseReviewContent = {
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCE" | "ALL_LEVELS" | null;
  skills: string[];
  tags: string[];
  certificateKind: "PARTICIPATION" | "COMPLETION" | null;
  curriculum: ReviewCurriculum | null;
  quiz: ReviewQuiz | null;
};

export const DIFFICULTY_LABELS: Record<
  NonNullable<CourseReviewContent["difficulty"]>,
  string
> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCE: "Advance",
  ALL_LEVELS: "All levels",
};

export const LESSON_TYPE_LABELS: Record<ReviewLesson["type"], string> = {
  YOUTUBE: "YouTube",
  PDF: "PDF",
  AUDIO: "Audio",
};

export const CERTIFICATE_LABELS: Record<
  NonNullable<CourseReviewContent["certificateKind"]>,
  string
> = {
  PARTICIPATION: "Certificate of participation",
  COMPLETION: "Certificate of completion",
};

/** Pulls the review content off a course, tolerating an older API. */
export function readCourseReviewContent(course: unknown): CourseReviewContent {
  const source = (course ?? {}) as Partial<CourseReviewContent>;

  return {
    difficulty: source.difficulty ?? null,
    skills: Array.isArray(source.skills) ? source.skills : [],
    tags: Array.isArray(source.tags) ? source.tags : [],
    certificateKind: source.certificateKind ?? null,
    curriculum: source.curriculum ?? null,
    quiz: source.quiz ?? null,
  };
}
