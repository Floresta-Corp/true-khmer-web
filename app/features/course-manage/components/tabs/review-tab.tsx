import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { StarRating } from "~/features/education/components/star-rating";
import type { CourseReview } from "~/features/education/types";
import type { CourseReviewsPage } from "~/features/course-manage/types";
import { MANAGE_CARD } from "../overview/course-kpi-cards";

const COLLAPSED = 3;

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

interface ReviewTabProps {
  courseId: string;
  status: string;
  rating: number;
  reviewCount: number;
  /** The loader's first page. */
  reviews: CourseReview[];
  /** Totals from the reviews endpoint, so paging knows where it ends. */
  total: number;
  pages: number;
}

export function ReviewTab({
  courseId,
  status,
  rating,
  reviewCount,
  reviews,
  total,
  pages,
}: ReviewTabProps) {
  const fetcher = useFetcher<CourseReviewsPage>();
  const [expanded, setExpanded] = useState(false);

  /* Page one comes from the loader; later pages are appended here. Keyed off
     the fetcher's payload identity so a re-render never appends twice. */
  const [extra, setExtra] = useState<CourseReview[]>([]);
  const [page, setPage] = useState(1);
  const lastAppended = useRef<unknown>(null);

  /* A different course, or reviews reloaded under us, resets the tail. */
  useEffect(() => {
    setExtra([]);
    setPage(1);
    lastAppended.current = null;
  }, [reviews]);

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if (lastAppended.current === fetcher.data) return;
    lastAppended.current = fetcher.data;

    setExtra((current) => [...current, ...fetcher.data!.reviews]);
  }, [fetcher.state, fetcher.data]);

  const loaded = [...reviews, ...extra];
  const visible = expanded ? loaded : loaded.slice(0, COLLAPSED);
  const hasMore = page < pages;
  const busy = fetcher.state !== "idle";

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetcher.load(`/course-listing/${courseId}/reviews?page=${next}`);
  };

  const published = status === "PUBLISHED";

  return (
    <div className="flex flex-col gap-6">
      {published || reviews.length > 0 ? (
        <div className={`${MANAGE_CARD} px-[30px] pt-7 pb-8`}>
          <h3 className="mb-5 text-lg font-bold text-[#1A1A2E]">
            Learner reviews
          </h3>

          <div className="mb-5 flex items-center gap-4">
            <span className="text-[38px] leading-none font-extrabold text-[#1A1A2E]">
              {rating.toFixed(1)}
            </span>
            <div>
              <StarRating value={rating} />
              <p className="text-[13px] text-[#9A9AB0]">
                {reviewCount.toLocaleString()} reviews
              </p>
            </div>
          </div>

          <ul className="flex flex-col gap-[18px]">
            {visible.map((review, index) => (
              <li
                key={review.id}
                className={
                  index < visible.length - 1
                    ? "border-b border-[#E5E7EB] pb-[18px]"
                    : undefined
                }
              >
                <div className="mb-1.5 flex items-center gap-2.5">
                  {review.avatarUrl ? (
                    <span className="size-8 shrink-0 overflow-hidden rounded-full bg-[#E8E8E8]">
                      <img
                        src={review.avatarUrl}
                        alt=""
                        loading="lazy"
                        className="size-full object-cover"
                      />
                    </span>
                  ) : (
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#D5E2FA] text-[13px] font-bold text-[#1C5DD4]">
                      {initials(review.name)}
                    </span>
                  )}
                  <span className="text-sm font-bold text-[#1A1A2E]">
                    {review.name}
                  </span>
                  <StarRating value={review.rating} starClassName="size-3" />
                </div>
                <p className="text-sm leading-[1.6] text-[#9A9AB0]">
                  {review.comment}
                </p>
              </li>
            ))}
          </ul>

          {/* `total` is the count on the course, not the count in hand: the
              loader brings one page, so the button has to promise what paging
              will actually reach rather than what is already rendered. */}
          <div className="mt-5 flex flex-wrap gap-3">
            {loaded.length > COLLAPSED && (
              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                className="cursor-pointer rounded-full border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-semibold text-[#1C5DD4] transition-colors hover:border-[#1C5DD4]"
              >
                {expanded ? "Show fewer reviews" : `Show all ${total} reviews`}
              </button>
            )}

            {expanded && hasMore && (
              <button
                type="button"
                onClick={loadMore}
                disabled={busy}
                className="cursor-pointer rounded-full border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-semibold text-[#1C5DD4] transition-colors hover:border-[#1C5DD4] disabled:opacity-50"
              >
                {busy ? "Loading…" : "Load more reviews"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className={`${MANAGE_CARD} px-6 py-12 text-center`}>
          <p className="text-sm font-semibold text-[#1A1A2E]">No reviews yet</p>
          <p className="mt-1.5 text-[13px] text-[#9A9AB0]">
            Reviews will appear once your course is published and learners start
            rating it.
          </p>
        </div>
      )}
    </div>
  );
}
