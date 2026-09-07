import { cn } from "~/lib/utils";
import type { CourseDisplayStatus } from "~/features/course-listing/types";

/**
 * Two treatments for the same six states.
 *
 * `subtle` is the pastel chip the list row and the course header use on white.
 * `overlay` is the saturated, white-on-colour pill the grid card floats over
 * its cover, where a pastel chip would be unreadable against a photo.
 */
type BadgeVariant = "subtle" | "overlay";

const SUBTLE: Record<CourseDisplayStatus, string> = {
  PUBLISHED: "bg-[#EEF8F1] text-[#28522E]",
  DRAFT: "bg-[#E8E8E8] text-[#8787A0]",
  PENDING: "bg-[#F8EDE1] text-[#CD640F]",
  REJECTED: "bg-[#F9E7E6] text-[#C93A32]",
  // No design reference for UNPUBLISHED; reuse the neutral treatment rather
  // than inventing a colour.
  UNPUBLISHED: "bg-[#E2E8F0] text-[#475569]",
};

/** Draft alone is translucent, so the cover reads through it. */
const OVERLAY: Record<CourseDisplayStatus, string> = {
  PUBLISHED: "bg-[#1FA463] text-white",
  DRAFT: "bg-[#3D3D4E]/65 text-white backdrop-blur-sm",
  PENDING: "bg-[#E8850C] text-white",
  REJECTED: "bg-[#E23B33] text-white",
  UNPUBLISHED: "bg-[#305CCD] text-white",
};

const LABELS: Record<CourseDisplayStatus, string> = {
  PUBLISHED: "Published",
  DRAFT: "Draft",
  PENDING: "In-review",
  REJECTED: "Rejected",
  UNPUBLISHED: "Unpublished",
};

export function CourseStatusBadge({
  status,
  variant = "subtle",
  className,
}: {
  status: CourseDisplayStatus;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full whitespace-nowrap",
        variant === "overlay"
          ? "px-3.5 py-1 text-[13px] font-bold shadow-[0_1px_4px_rgba(0,0,0,0.18)]"
          : "px-3 py-0.5 text-[12px] font-semibold",
        variant === "overlay" ? OVERLAY[status] : SUBTLE[status],
        className,
      )}
    >
      {LABELS[status]}
    </span>
  );
}
