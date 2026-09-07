import type { Route } from "project-types/course-manage/route/+types/course-manage.$id.reviews";
import { listCourseReviews } from "~/api/education/education.server";
import { toManageReviews } from "~/features/course-manage/lib/manage-reviews";
import { REVIEW_PAGE_SIZE } from "~/features/course-manage/types";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";

/**
 * One page of a course's reviews, for the Review tab's fetcher.
 *
 * A resource route of its own for the same reason the roster has one: reading
 * further into the reviews must not refetch the course, its curriculum, its
 * stats and a page of its students alongside them.
 */
export async function courseReviewsLoader({
  request,
  params,
}: Route.LoaderArgs) {
  const auth = await requireUser(request);

  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? "1");

  const result = await listCourseReviews(request, params.id, {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    limit: REVIEW_PAGE_SIZE,
  });

  return withAuthData(auth, {
    reviews: toManageReviews(result?.data?.reviews ?? []),
    total: result?.data?.pagination.total ?? 0,
    totalPages: result?.data?.pagination.totalPages ?? 0,
  });
}
