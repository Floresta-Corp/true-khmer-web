import { Link } from "react-router";
import { resolveImageURL } from "~/lib/utils";
import type { Opportunity } from "~/features/volunteer/types/volunteer-types";

const volunteerPlaceholderImage = "/images/volunteer-placeholder.svg";

interface VolunteerCompactCardProps {
  opportunity: Opportunity;
}

export function VolunteerCompactCard({
  opportunity,
}: VolunteerCompactCardProps) {
  const image = resolveImageURL(
    opportunity.coverImageKey,
    volunteerPlaceholderImage,
  );
  const spotsLeft = Math.max(
    opportunity.capacity - opportunity.applicationCount,
    0,
  );

  return (
    <Link
      to={`/volunteer/detail/${opportunity.id}`}
      className="group flex items-stretch gap-4 overflow-hidden rounded-xl border border-[#e1e7ef] bg-white transition-colors hover:border-[#2f6fe4]"
    >
      <img
        src={image}
        alt={opportunity.title}
        className="h-24 w-26 shrink-0 object-cover"
        loading="lazy"
      />

      <div className="flex min-w-0 flex-col justify-center gap-1 py-3 pr-4">
        <p className="truncate text-xs text-[#99a1af]">
          {opportunity.category.name} · {opportunity.location.name}
        </p>
        <h3 className="truncate text-[15px] font-bold text-[#1e293b] transition-colors group-hover:text-[#1c5dd4]">
          {opportunity.title}
        </h3>
        <p className="text-[12px] font-medium text-[#1c5dd4]">
          {spotsLeft > 0 ? `${spotsLeft} spots left` : "No spots left"}
        </p>
      </div>
    </Link>
  );
}
