import type {
  CourseLearnerStats,
  MyCourse,
} from "~/features/course-listing/types";

/**
 * Placeholder learner engagement for the Course Listing rows.
 *
 * The design shows Total learners / Completed / In progress / Not started per
 * published course. Nothing on the API exposes this: the education-center
 * surface is categories, course CRUD, submit, unpublish, withdraw,
 * cover/presign and courses/mine — there is no enrolment or progress resource,
 * and `CourseResponse` carries no learner counts.
 *
 * Numbers are derived from the course id so a row shows the same figures on
 * every render rather than reshuffling. Replace `buildLearnerStats` with the
 * real call when the endpoint lands.
 */

/** FNV-1a, so the same id always yields the same figures. */
function hash(value: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function buildLearnerStats(course: MyCourse): CourseLearnerStats {
  const seed = hash(course.id);

  const totalLearners = 120 + (seed % 2400);
  const completedPercent = 35 + (seed % 45);
  const inProgressPercent = Math.min(
    100 - completedPercent,
    10 + ((seed >>> 8) % 35),
  );
  const notStartedPercent = 100 - completedPercent - inProgressPercent;

  // Derive counts from the percentages, then give the remainder to the largest
  // bucket so the three always add back up to the total.
  const completed = Math.round((totalLearners * completedPercent) / 100);
  const inProgress = Math.round((totalLearners * inProgressPercent) / 100);
  const notStarted = totalLearners - completed - inProgress;

  return {
    totalLearners,
    completed: { percent: completedPercent, learners: completed },
    inProgress: { percent: inProgressPercent, learners: inProgress },
    notStarted: { percent: notStartedPercent, learners: notStarted },
  };
}
