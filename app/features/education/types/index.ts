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
  type?: "course" | "ks";
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
  duration: string;
  isPreview: boolean;
  isComplete: boolean;
  sourceUrl?: string | null;
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

/** The signed-in learner's own rating of a course, absent until they leave one. */
export interface OwnCourseReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface CourseDetail extends CourseSummary {
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
  recipientName: string;
  courseTitle: string;
  completedOn: string;
}
