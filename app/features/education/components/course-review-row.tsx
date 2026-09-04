import type { CourseReview } from "~/features/education/types";
import { StarRating } from "./star-rating";

export function CourseReviewRow({ review }: { review: CourseReview }) {
  return (
    <div className="rounded-[10px] border border-[#E5E7EB] p-4">
      <div className="mb-1.5 flex items-center gap-2.5">
        <span className="size-8 shrink-0 overflow-hidden rounded-full bg-[#E8E8E8]">
          <img
            src={review.avatarUrl ?? "/images/avatar_placeholder.webp"}
            alt=""
            className="size-full object-cover"
          />
        </span>
        <span className="text-sm font-bold text-[#1A1A2E]">{review.name}</span>
        <StarRating value={review.rating} starClassName="size-3.25" />
      </div>
      <p className="text-sm leading-[1.6] text-[#9A9AB0]">{review.comment}</p>
    </div>
  );
}
