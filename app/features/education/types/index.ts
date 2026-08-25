/**
 * Domain types for the Education Center.
 *
 * The shapes here follow the "True Khmer V2" design (Education hub, Course
 * detail, Course learning, Quiz, Quiz result, Certificate). Only a subset is
 * backed by the API today — see `~/features/education/lib/education-fixtures`
 * for the parts that are still placeholder data.
 */

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
  /** e.g. "6 courses published" */
  coursesPublished: number;
}

export type CourseLevel = "Beginner" | "Intermediate" | "Advance";

/** A course as rendered in the hub's class-card grids. */
export interface CourseSummary {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  /** Shown uppercase above the card title. */
  categoryName: string;
  coverImageUrl: string | null;
  instructor: CourseInstructor;
  rating: number;
  /** Number of ratings, shown in parentheses next to the star. */
  ratingCount: number;
  level: CourseLevel;
  lessonCount: number;
  /** Enrolled learners, shown next to the people icon. */
  studentCount: number;
  /** Renders the green "New" badge on the cover. */
  isNew: boolean;
  /** Price in USD. `0` renders as the green "Free" pill. */
  price: number;
  isSaved: boolean;
}

/** The learner's own progress, shown on the hero's floating cards. */
export interface LearnerSnapshot {
  displayName: string;
  dayStreak: number;
  goalTitle: string;
  goalPercent: number;
  continueCourseTitle: string;
  continuePercent: number;
  platformRating: number;
  platformReviewCount: number;
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
  /** Human-readable, e.g. "08:24". */
  duration: string;
  /** Playable before enrolling. */
  isPreview: boolean;
  isComplete: boolean;
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

/** A course as rendered on the detail and learning screens. */
export interface CourseDetail extends CourseSummary {
  meta: CourseMetaItem[];
  outcomes: string[];
  curriculum: CourseSection[];
  reviews: CourseReview[];
  reviewCount: number;
  enrolledCount: number;
  isEnrolled: boolean;
  /** 0–100. */
  progressPercent: number;
  status: CourseStatus;
}

/** The lesson currently open in the learning player. */
export interface ActiveLesson extends CourseLesson {
  sectionId: string;
  sectionTitle: string;
  /** 1-based position across the whole course. */
  index: number;
  heading: string;
  description: string;
  outcomes: string[];
  /** Still frame for the video player / cover for audio. */
  posterUrl: string | null;
  elapsed: string;
}

export interface QuizAnswerOption {
  id: string;
  label: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizAnswerOption[];
  correctOptionId: string;
}

/** A question as sent to the browser — the correct answer is withheld. */
export type PublicQuizQuestion = Omit<QuizQuestion, "correctOptionId">;

export interface CourseQuiz {
  id: string;
  courseId: string;
  /** Percentage needed to pass, e.g. 70. */
  passMark: number;
  questions: QuizQuestion[];
}

/** The quiz as sent to the browser. */
export interface PublicCourseQuiz extends Omit<CourseQuiz, "questions"> {
  questions: PublicQuizQuestion[];
}

export interface QuizAttemptResult {
  correctCount: number;
  totalCount: number;
  percent: number;
  passed: boolean;
}

export interface CourseCertificate {
  recipientName: string;
  courseTitle: string;
  /** Pre-formatted for display, e.g. "12 August 2026". */
  completedOn: string;
}
