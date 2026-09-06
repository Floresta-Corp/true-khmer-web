import { useState } from "react";
import { StarRating } from "~/features/education/components/star-rating";
import type { CourseReview } from "~/features/education/types";
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
  status: string;
  rating: number;
  reviewCount: number;
  reviews: CourseReview[];
}

export function ReviewTab({
  status,
  rating,
  reviewCount,
  reviews,
}: ReviewTabProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? reviews : reviews.slice(0, COLLAPSED);

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

          {reviews.length > COLLAPSED && (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="mt-5 cursor-pointer rounded-full border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-semibold text-[#1C5DD4] transition-colors hover:border-[#1C5DD4]"
            >
              {expanded
                ? "Show fewer reviews"
                : `Show all ${reviews.length} reviews`}
            </button>
          )}
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
