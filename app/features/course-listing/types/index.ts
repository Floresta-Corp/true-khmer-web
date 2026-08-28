import { z } from "zod";
import type { CourseResponse } from "~/types/api-client";

/** Publication states the API reports for a course. */
export const CourseStatusSchema = z.enum([
  "DRAFT",
  "PENDING",
  "PUBLISHED",
  "UNPUBLISHED",
]);
export type CourseStatus = z.infer<typeof CourseStatusSchema>;

/**
 * The design shows a "Rejected" state that the API has no status for: a
 * rejected course comes back as DRAFT carrying `rejectedAt`/`rejectionNote`.
 * Rows and tabs work off this derived value rather than `status` alone.
 */
export type CourseDisplayStatus = CourseStatus | "REJECTED";

export function displayStatusOf(course: MyCourse): CourseDisplayStatus {
  if (course.rejectedAt && course.status === "DRAFT") return "REJECTED";
  return course.status;
}

export const CourseTabSchema = z.enum([
  "all",
  "draft",
  "in-review",
  "published",
  "rejected",
]);
export type CourseTab = z.infer<typeof CourseTabSchema>;

export const TABS: { label: string; value: CourseTab }[] = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "In-review", value: "in-review" },
  { label: "Published", value: "published" },
  { label: "Rejected", value: "rejected" },
];

/**
 * Status sent to the API per tab. Draft and Rejected share DRAFT and are told
 * apart client-side, since `status=` cannot express "rejected".
 */
export const TAB_STATUS: Record<CourseTab, CourseStatus | undefined> = {
  all: undefined,
  draft: "DRAFT",
  "in-review": "PENDING",
  published: "PUBLISHED",
  rejected: "DRAFT",
};

export type MyCourse = CourseResponse;

/** Learner engagement for a published course. No API endpoint exposes this. */
export interface CourseLearnerStats {
  totalLearners: number;
  completed: { percent: number; learners: number };
  inProgress: { percent: number; learners: number };
  notStarted: { percent: number; learners: number };
}

export type CourseWithStats = MyCourse & {
  stats: CourseLearnerStats | null;
};

export interface MyCoursesPagination {
  limit: number;
  hasMore: boolean;
  nextCursor: string | null;
  total: number;
}
