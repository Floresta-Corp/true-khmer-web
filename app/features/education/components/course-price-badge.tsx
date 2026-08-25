import { cn } from "~/lib/utils";

interface CoursePriceBadgeProps {
  price: number;
  className?: string;
}

/** Renders the green "Free" pill from the design, or the course price. */
export function CoursePriceBadge({ price, className }: CoursePriceBadgeProps) {
  const isFree = price <= 0;

  return (
    <span
      className={cn(
        "rounded-full px-3.5 py-1 text-sm font-extrabold",
        isFree
          ? "bg-[#1FC16B]/15 text-[#1FC16B]"
          : "bg-[#1C5DD4]/10 text-[#1C5DD4]",
        className,
      )}
    >
      {isFree ? "Free" : `$${price.toFixed(2)}`}
    </span>
  );
}
