import { useState } from "react";
import { CARD } from "~/features/education/lib/education-styles";
import type { CourseDetail } from "~/features/education/types";
import { StarRating } from "./star-rating";

const COLLAPSED_COUNT = 3;

export function CourseReviewsTab({ course }: { course: CourseDetail }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded
    ? course.reviews
    : course.reviews.slice(0, COLLAPSED_COUNT);

  return (
    <div className={`${CARD} px-6 pt-7 pb-8 sm:px-7.5`}>
      <div className="mb-5 flex items-center gap-4">
        <span className="text-[38px] leading-none font-extrabold text-[#1A1A2E]">
          {course.rating.toFixed(1)}
        </span>
        <div>
          <StarRating value={course.rating} />
          <p className="mt-1 text-xs text-[#9A9AB0]">
            {course.reviewCount.toLocaleString()} reviews
          </p>
        </div>
      </div>

      {course.reviews.length === 0 ? (
        <p className="text-sm text-[#9A9AB0]">
          No reviews yet — be the first to rate this course.
        </p>
      ) : (
        <>
          <ul className="flex flex-col gap-4.5">
            {visible.map((review) => (
              <li key={review.id} className="border-b border-gray-200 pb-4">
                <div className="mb-1.5 flex items-center gap-2.5">
                  <span className="size-8 shrink-0 overflow-hidden rounded-full bg-[#E8E8E8]">
                    <img
                      src={
                        review.avatarUrl ?? "/images/avatar_placeholder.webp"
                      }
                      alt=""
                      className="size-full object-cover"
                    />
                  </span>
                  <span className="text-sm font-bold text-[#1A1A2E]">
                    {review.name}
                  </span>
                  <StarRating value={review.rating} starClassName="size-3" />
                </div>
                <p className="text-sm leading-relaxed text-[#9A9AB0]">
                  {review.comment}
                </p>
              </li>
            ))}
          </ul>

          {course.reviews.length > COLLAPSED_COUNT && (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="mt-5 cursor-pointer rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#1C5DD4] transition-colors hover:border-[#1C5DD4]"
            >
              {expanded
                ? "Show fewer reviews"
                : `Show all ${course.reviews.length} reviews`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
