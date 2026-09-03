import { z } from "zod";

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

export function readCourseReviewContent(course: unknown): CourseReviewContent {
  const source = (course ?? {}) as Partial<CourseReviewContent>;
  const { curriculum, quiz } = source;

  return {
    difficulty: source.difficulty ?? null,
    skills: Array.isArray(source.skills) ? source.skills : [],
    tags: Array.isArray(source.tags) ? source.tags : [],
    certificateKind: source.certificateKind ?? null,
    curriculum: Array.isArray(curriculum?.chapters) ? curriculum : null,
    quiz: Array.isArray(quiz?.questions) ? quiz : null,
  };
}
