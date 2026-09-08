import { data } from "react-router";
import type { Route } from "project-types/course-manage/route/+types/course-manage.$id";
import {
  getCourseCurriculum,
  getCourseStats,
  getOwnedCourseById,
  listCourseReviews,
  listCourseStudents,
} from "~/api/education/education.server";
import {
  buildAnalytics,
  buildManageOverview,
  buildRatingBreakdown,
  buildTrends,
} from "~/features/course-manage/lib/manage-overview";
import { toManageReviews } from "~/features/course-manage/lib/manage-reviews";
import { buildReviewStages } from "~/features/course-manage/lib/review-stages";
import { toCourseSections } from "~/features/education/lib/map-curriculum";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";
import {
  REVIEW_PAGE_SIZE,
  STUDENT_PAGE_SIZE,
} from "~/features/course-manage/types";

export async function courseManageLoader({
  request,
  params,
}: Route.LoaderArgs) {
  const auth = await requireUser(request);

  const [result, curriculumResult, statsResult, reviewsResult, studentsResult] =
    await Promise.all([
      getOwnedCourseById(request, params.id),
      getCourseCurriculum(request, params.id),
      getCourseStats(request, params.id),
      /* First pages only. Both the Review and Students tabs page further
         themselves, so neither pulls a whole list to render a screenful. */
      listCourseReviews(request, params.id, { limit: REVIEW_PAGE_SIZE }),
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
    reviews: toManageReviews(reviewsResult?.data?.reviews ?? []),
    /* How many there are in total, so the Review tab can say what "show all"
       will fetch and know when it has reached the end. */
    reviewPages: reviewsResult?.data?.pagination.totalPages ?? 0,
    reviewTotal: reviewsResult?.data?.pagination.total ?? 0,
    ratingBreakdown: buildRatingBreakdown(stats),
    students: studentsResult?.data ?? null,
    reviewStages: buildReviewStages(course),
    analytics: buildAnalytics(stats),
  });
}
