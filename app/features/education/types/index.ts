export type CourseStatus = "DRAFT" | "PENDING" | "PUBLISHED" | "UNPUBLISHED";

export type LessonType = "video" | "pdf" | "audio";

export interface CourseCategory {
  id: string;
  name: string;
  slug: string | null;
  iconKey: string | null;
}

export interface CourseInstructor {
  id: string | null;
  name: string;
  avatarUrl: string | null;
  coursesPublished: number;
  phone: string | null;
  email: string | null;
}

export type CourseLevel = "Beginner" | "Intermediate" | "Advance";

export interface CourseSummary {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  coverImageUrl: string | null;
  instructor: CourseInstructor;
  rating: number;
  ratingCount: number;
  level: CourseLevel;
  lessonCount: number;
  studentCount: number;
  isNew: boolean;
  price: number;
  isSaved: boolean;
}

export interface CourseMetaItem {
  label: string;
  value: string;
  isRating?: boolean;
}

export interface CourseLesson {
  id: string;
  title: string;
  type: LessonType;
  /** Human-readable length, for the curriculum lists. */
  duration: string;
  /**
   * The creator's recorded length in seconds, if anything measured it.
   *
   * Kept alongside the formatted string because the gate needs arithmetic: a
   * video is finished at a share of its length, not of its label.
   */
  durationSeconds: number | null;
  isPreview: boolean;
  isComplete: boolean;
  /**
   * Locked until the lesson before it is finished, as the API resolved it for
   * this learner. The media of a locked lesson is withheld, so `sourceUrl` is
   * null whenever this is true.
   *
   * Optional because only a learner has a frontier to be behind: the course
   * builder and its preview build lessons that nothing is gating, and absent
   * reads as unlocked.
   */
  isLocked?: boolean;
  sourceUrl?: string | null;
  pageCount?: number | null;
}

/**
 * How much of a timed lesson counts as having watched it.
 *
 * The tail of a video is usually credits, so holding out for the whole thing
 * would leave learners stuck on a lesson they have finished. Mirrors
 * `LESSON_COMPLETION_RATIO` in the API, which checks the figure we report.
 */
export const LESSON_COMPLETION_RATIO = 0.95;

/**
 * Whether a lesson may be marked finished yet.
 *
 * Each player measures its own medium and reports one of these up: a video or
 * audio lesson counts the seconds actually played, a PDF counts time spent on
 * it. The learner screen turns it into the call that records the lesson, and
 * into whether Next is open.
 */
export interface LessonGateState {
  /** How far through the requirement the learner is, 0 to 1. */
  ratio: number;
  /** The requirement is met — the lesson can be recorded as finished. */
  isSatisfied: boolean;
  /** Seconds of media played, for the API to check. Null for a PDF. */
  watchedSeconds: number | null;
  /**
   * Where to put the player back when the learner returns.
   *
   * The play head for a video or audio lesson; zero for a document, which has
   * no position — its resume point is the reading time already served, which
   * rides in `watchedSeconds`.
   */
  positionSeconds: number;
}

/**
 * Where a learner stopped inside a lesson.
 *
 * Read back on the next visit so a part-watched lesson opens where it was left
 * rather than at the beginning, and so the coverage that opens the next lesson
 * survives closing the tab.
 */
export interface LessonResumePoint {
  lessonId: string;
  positionSeconds: number;
  watchedSeconds: number;
  updatedAt: string;
}

export interface CourseSection {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

export interface CourseReview {
  id: string;
  name: string;
  avatarUrl: string | null;
  rating: number;
  comment: string;
}

export interface OwnCourseReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export type CourseFormat = "MULTI" | "SINGLE";

export interface CourseDetail extends CourseSummary {
  format: CourseFormat;
  meta: CourseMetaItem[];
  hasQuiz: boolean;
  certificateKind: "PARTICIPATION" | "COMPLETION" | null;
  skills: string[];
  outcomes: string[];
  curriculum: CourseSection[];
  reviews: CourseReview[];
  reviewCount: number;
  enrolledCount: number;
  isEnrolled: boolean;
  progressPercent: number;
  status: CourseStatus;
}

export interface ActiveLesson extends CourseLesson {
  sectionId: string;
  sectionTitle: string;
  index: number;
  heading: string;
  description: string;
  outcomes: string[];
  posterUrl: string | null;
  elapsed: string;
}

export interface QuizAnswerOption {
  id: string;
  label: string;
}

export interface PublicQuizQuestion {
  id: string;
  question: string;
  options: QuizAnswerOption[];
}

export interface PublicCourseQuiz {
  id: string;
  courseId: string;
  passMark: number;
  questions: PublicQuizQuestion[];
}

export interface QuizAttemptResult {
  correctCount: number;
  totalCount: number;
  percent: number;
  passed: boolean;
}

export interface CourseCertificate {
  courseId: string;
  certificateNo: string;
  recipientName: string;
  courseTitle: string;
  completedOn: string;
  sharedToProfile: boolean;
}

export interface ProfileCertificate {
  id: string;
  courseId: string;
  courseTitle: string;
  certificateNo: string;
  completedAt: string;
  sharedToProfile: boolean;
}
