import { cn } from "~/lib/utils";
import type { CourseDisplayStatus } from "~/features/course-listing/types";

const STATUS: Record<
  CourseDisplayStatus,
  { label: string; className: string }
> = {
  PUBLISHED: { label: "Published", className: "bg-[#EEF8F1] text-[#28522E]" },
  DRAFT: { label: "Draft", className: "bg-[#E8E8E8] text-[#8787A0]" },
  PENDING: { label: "In-review", className: "bg-[#F8EDE1] text-[#CD640F]" },
  REJECTED: { label: "Rejected", className: "bg-[#F9E7E6] text-[#C93A32]" },
  // No design reference for UNPUBLISHED; reuse the neutral treatment rather
  // than inventing a colour.
  UNPUBLISHED: {
    label: "Unpublished",
    className: "bg-[#E2E8F0] text-[#475569]",
  },
};

export function CourseStatusBadge({
  status,
  className,
}: {
  status: CourseDisplayStatus;
  className?: string;
}) {
  const { label, className: tone } = STATUS[status];

  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-3 py-0.5 text-[12px] font-semibold whitespace-nowrap",
        tone,
        className,
      )}
    >
      {label}
    </span>
  );
}
