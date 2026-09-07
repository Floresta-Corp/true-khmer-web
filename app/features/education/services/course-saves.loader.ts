import { listMyClasses } from "~/api/education/my-classes.server";
import type { CourseSummary } from "~/features/education/types";

/* The saved tab caps at 100 per page; one page is enough to mark up a
   catalogue page, and the My Classes screen is where a longer list belongs. */
const SAVED_LIMIT = 100;

/**
 * The IDs of the courses the viewer has bookmarked, or an empty set for a
 * guest — `listMyClasses` returns null rather than throwing when there is no
 * session, so a signed-out catalogue still renders.
 */
export async function loadSavedCourseIds(
  request: Request,
): Promise<Set<string>> {
  const response = await listMyClasses(request, {
    tab: "saved",
    limit: SAVED_LIMIT,
  });

  return new Set(
    (response?.data?.courses ?? []).map((course) => course.courseId),
  );
}

/** Stamps the viewer's save state onto catalogue summaries. */
export function withSaveState(
  courses: CourseSummary[],
  savedCourseIds: Set<string>,
): CourseSummary[] {
  return courses.map((course) =>
    savedCourseIds.has(course.id) ? { ...course, isSaved: true } : course,
  );
}
