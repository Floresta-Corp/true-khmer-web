import type { CourseStatsResponse } from "~/api/education/education.server";
import type {
  CourseLearnerStats,
  MyCourse,
} from "~/features/course-listing/types";

type Stats = CourseStatsResponse["stats"];

/**
 * Whether a course can have learners to report on.
 *
 * A draft, a pending submission and a rejected course have never been open to
 * enrolment, so their figures are a row of zeroes and the listing does not
 * spend a request asking for them. UNPUBLISHED does count: taking a course
 * down hides it from the catalogue, it does not unenrol anyone.
 */
export function reportsLearners(course: MyCourse) {
  return course.status === "PUBLISHED" || course.status === "UNPUBLISHED";
}

/** Same rounding as the manage screen, so the two never disagree by a point. */
function share(part: number, total: number) {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

/**
 * The server's progress split as the metric strip reads it: each bucket as a
 * share of the enrolled learners, plus the head count behind that share.
 *
 * Null when nobody is enrolled — the row then shows the design's em dash
 * rather than three honest-looking zeroes.
 */
export function toLearnerStats(
  stats: Stats | null | undefined,
): CourseLearnerStats | null {
  const progress = stats?.progress;
  if (!progress || progress.total <= 0) return null;

  const { total, completed, inProgress, notStarted } = progress;

  return {
    totalLearners: total,
    completed: { percent: share(completed, total), learners: completed },
    inProgress: { percent: share(inProgress, total), learners: inProgress },
    notStarted: { percent: share(notStarted, total), learners: notStarted },
  };
}
