import { Play, Star } from "lucide-react";
import type { ReactNode } from "react";

interface CourseDetailHeroProps {
  title: string;
  coverImageUrl: string | null;
  /** e.g. "12 lessons · Beginner" — the line under the title. */
  metaLine: string;
  /** Omitted entirely when no one has rated the course. */
  rating: number;
  reviewCount: number;
  enrolledLabel: string | null;
  actionLabel: string;
  showPlayIcon?: boolean;
  onAction: () => void;
  children?: ReactNode;
}

/**
 * The design's full-bleed 16/9 cover with the title, meta and primary action
 * sitting over a bottom gradient.
 */
export function CourseDetailHero({
  title,
  coverImageUrl,
  metaLine,
  rating,
  reviewCount,
  enrolledLabel,
  actionLabel,
  showPlayIcon = true,
  onAction,
}: CourseDetailHeroProps) {
  return (
    <div className="relative mb-8 aspect-video max-h-[480px] w-full overflow-hidden rounded-2xl bg-[#E8E8E8]">
      <img
        src={coverImageUrl ?? "/placeholder/images.svg"}
        alt=""
        className="size-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.35)_45%,rgba(0,0,0,0)_75%)]" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-start px-6 pb-6 sm:px-10 sm:pb-8">
        <h1 className="mb-2.5 line-clamp-2 text-xl leading-[1.15] font-extrabold text-white sm:text-[28px]">
          {title}
        </h1>

        {metaLine && (
          <div className="mb-2 text-[13px] text-white/80">{metaLine}</div>
        )}

        {/* Ratings and enrolment only appear once there is something to show. */}
        {(reviewCount > 0 || enrolledLabel) && (
          <div className="mb-3.5 flex flex-wrap items-center gap-2">
            {reviewCount > 0 && (
              <>
                <Star
                  className="size-3.5 fill-amber-400 text-amber-400"
                  aria-hidden
                />
                <span className="text-[13px] font-bold text-white">
                  {rating.toFixed(1)}
                </span>
                <span className="text-[13px] text-white/75">
                  ({reviewCount})
                </span>
              </>
            )}
            {reviewCount > 0 && enrolledLabel && (
              <span className="text-[13px] text-white/60">·</span>
            )}
            {enrolledLabel && (
              <span className="text-[13px] text-white/75">{enrolledLabel}</span>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onAction}
          /* --tk-brand-primary is primary-700 (#174FB4); hover steps to primary-800. */
          className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#174FB4] px-8 py-[11px] text-sm font-bold text-white transition-colors hover:bg-[#134195]"
        >
          {showPlayIcon && (
            <Play className="size-3.25 fill-white" aria-hidden />
          )}
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
