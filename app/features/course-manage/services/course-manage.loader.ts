import { data } from "react-router";
import type { Route } from "project-types/course-manage/route/+types/course-manage.$id";
import {
  getCourseById,
  getCourseCurriculum,
  getCourseStats,
} from "~/api/education/education.server";
import {
  buildAnalytics,
  buildManageOverview,
  buildStudents,
} from "~/features/course-manage/lib/manage-overview";
import { buildReviewStages } from "~/features/course-manage/lib/review-stages";
import { toCourseSections } from "~/features/education/lib/map-curriculum";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";

/**
 * Only the creator manages a course, so this sits behind a session.
 *
 * Real: the course, its curriculum, the review timeline, and every learner
 * figure derived from recorded lesson progress (learners, how far each has
 * got, completion, and the enrolment trend). Quiz attempts and ratings have
 * no resource, so those blocks report nothing recorded rather than estimates.
 */
export async function courseManageLoader({
  request,
  params,
}: Route.LoaderArgs) {
  const auth = await requireUser(request);

  const [result, curriculumResult, statsResult] = await Promise.all([
    getCourseById(request, params.id),
    getCourseCurriculum(request, params.id),
    getCourseStats(request, params.id),
  ]);
  const course = result?.data?.course ?? null;

  if (!course) {
    throw data({ message: "Course not found" }, { status: 404 });
  }

  const stats = statsResult?.data?.stats ?? null;
  const overview = buildManageOverview(stats);

  return withAuthData(auth, {
    course,
    overview,
    curriculum: curriculumResult?.data?.curriculum
      ? toCourseSections(curriculumResult.data.curriculum)
      : [],
    // Ratings and reviews have no resource, so these stay empty.
    reviews: [],
    ratingBreakdown: [],
    students: buildStudents(stats),
    reviewStages: buildReviewStages(course),
    analytics: buildAnalytics(stats),
  });
}
