import { data } from "react-router";
import type { Route } from "project-types/course-manage/route/+types/course-manage.$id";
import {
  getCourseById,
  getCourseCurriculum,
  getCourseStats,
  listCourseReviews,
  listCourseStudents,
} from "~/api/education/education.server";
import {
  buildAnalytics,
  buildManageOverview,
  buildRatingBreakdown,
  buildTrends,
} from "~/features/course-manage/lib/manage-overview";
import { buildReviewStages } from "~/features/course-manage/lib/review-stages";
import { toCourseSections } from "~/features/education/lib/map-curriculum";
import { resolveImageURL } from "~/lib/utils";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";
import { STUDENT_PAGE_SIZE } from "~/features/course-manage/types";

export async function courseManageLoader({
  request,
  params,
}: Route.LoaderArgs) {
  const auth = await requireUser(request);

  const [result, curriculumResult, statsResult, reviewsResult, studentsResult] =
    await Promise.all([
      getCourseById(request, params.id),
      getCourseCurriculum(request, params.id),
      getCourseStats(request, params.id),
      /* First pages only. Both the Review and Students tabs page further
         themselves, so neither pulls a whole list to render a screenful. */
      listCourseReviews(request, params.id, { limit: 20 }),
      listCourseStudents(request, params.id, { limit: STUDENT_PAGE_SIZE }),
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
    /* Raw daily series: the chart windows them client-side, so changing the
       range costs no round trip. */
    trends: buildTrends(stats),
    curriculum: curriculumResult?.data?.curriculum
      ? toCourseSections(curriculumResult.data.curriculum)
      : [],
    reviews: (reviewsResult?.data?.reviews ?? []).map((review) => ({
      id: review.id,
      name: review.name,
      avatarUrl: review.avatar ? resolveImageURL(review.avatar) : null,
      rating: review.rating,
      comment: review.comment ?? "",
    })),
    ratingBreakdown: buildRatingBreakdown(stats),
    students: studentsResult?.data ?? null,
    reviewStages: buildReviewStages(course),
    analytics: buildAnalytics(stats),
  });
}
