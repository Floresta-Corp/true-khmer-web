import { data } from "react-router";
import type { Route } from "project-types/course-manage/route/+types/course-manage.$id";
import {
  getCourseCurriculum,
  getCourseStats,
  getOwnedCourseById,
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

export async function courseManageLoader({
  request,
  params,
}: Route.LoaderArgs) {
  const auth = await requireUser(request);

  const [result, curriculumResult, statsResult] = await Promise.all([
    getOwnedCourseById(request, params.id),
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
    reviews: [],
    ratingBreakdown: [],
    students: buildStudents(stats),
    reviewStages: buildReviewStages(course),
    analytics: buildAnalytics(stats),
  });
}
