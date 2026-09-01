import { data } from "react-router";
import type { Route } from "project-types/course-manage/route/+types/course-manage.$id";
import {
  getCourseById,
  getCourseCurriculum,
} from "~/api/education/education.server";
import { MY_COURSES_FIXTURES } from "~/features/course-listing/lib/my-courses-fixtures";
import {
  buildAnalytics,
  buildManageOverview,
  buildRatingBreakdown,
  buildReviewStages,
  buildStudents,
} from "~/features/course-manage/lib/course-manage-fixtures";
import { toCourseSections } from "~/features/education/lib/map-curriculum";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";

/**
 * Only the creator manages a course, so this sits behind a session. The course
 * itself is real when the API knows it; the Course Listing placeholders resolve
 * here too, so the screen can be reviewed against the design.
 */
export async function courseManageLoader({
  request,
  params,
}: Route.LoaderArgs) {
  const auth = await requireUser(request);

  const [result, curriculumResult] = await Promise.all([
    getCourseById(request, params.id),
    getCourseCurriculum(request, params.id),
  ]);
  const course =
    result?.data?.course ??
    MY_COURSES_FIXTURES.find((entry) => entry.id === params.id) ??
    null;

  if (!course) {
    throw data({ message: "Course not found" }, { status: 404 });
  }

  const overview = {
    ...buildManageOverview(course),
    // The one figure that is real.
    lessonCount: curriculumResult?.data?.curriculum.lessonCount ?? 0,
  };

  return withAuthData(auth, {
    course,
    overview,
    curriculum: curriculumResult?.data?.curriculum
      ? toCourseSections(curriculumResult.data.curriculum)
      : [],
    // Reviews have no API resource; an empty list beats invented ones.
    reviews: [],
    students: buildStudents(course, overview),
    ratingBreakdown: buildRatingBreakdown(
      course,
      overview.rating,
      overview.reviewCount,
    ),
    reviewStages: buildReviewStages(course),
    analytics: buildAnalytics(course, overview),
  });
}
