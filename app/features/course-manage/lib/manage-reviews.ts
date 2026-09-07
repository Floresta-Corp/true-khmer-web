import type { CourseReviewResponse } from "~/api/education/education.server";
import type { CourseReview } from "~/features/education/types";
import { resolveImageURL } from "~/lib/utils";

/**
 * Review rows as the tab reads them.
 *
 * Shared by the course loader and the reviews resource route, so a page
 * appended by the fetcher is shaped exactly like the first one — including the
 * resolved avatar URL, which the tab has no way to build itself.
 */
export function toManageReviews(rows: CourseReviewResponse[]): CourseReview[] {
  return rows.map((review) => ({
    id: review.id,
    name: review.name,
    avatarUrl: review.avatar ? resolveImageURL(review.avatar) : null,
    rating: review.rating,
    comment: review.comment ?? "",
  }));
}
