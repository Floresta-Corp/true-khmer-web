import { Link } from "react-router";
import dayjs from "dayjs";
import { resolveImageURL } from "~/lib/utils";
import type { LaunchpadOpportunity } from "~/features/launchpad/types";

const launchpadPlaceholderImage = "/images/volunteer-placeholder.svg";

interface LaunchpadCompactCardProps {
  item: LaunchpadOpportunity;
}

export function LaunchpadCompactCard({ item }: LaunchpadCompactCardProps) {
  const image = resolveImageURL(
    item.coverKey ?? item.logoKey,
    launchpadPlaceholderImage,
  );
  const deadline = dayjs(item.deadline);
  const deadlineLabel = deadline.isValid()
    ? `Deadline: ${deadline.format("MMM D")}`
    : null;

  return (
    <Link
      to={`/launchpad/detail/${item.id}`}
      className="group flex items-stretch gap-4 overflow-hidden rounded-xl border border-[#e1e7ef] bg-white transition-colors hover:border-[#2f6fe4]"
    >
      <img
        src={image}
        alt={item.name}
        className="h-24 w-26 shrink-0 object-cover"
        loading="lazy"
      />

      <div className="flex min-w-0 flex-col justify-center gap-1 py-3 pr-4">
        <p className="truncate text-xs text-[#99a1af]">
          {item.category.name} · {item.createdBy.name}
        </p>
        <h3 className="truncate text-[15px] font-semibold text-[#1e293b] transition-colors group-hover:text-[#1c5dd4]">
          {item.name}
        </h3>
        {deadlineLabel && (
          <p className="text-[12px] font-medium text-[#1c5dd4]">
            {deadlineLabel}
          </p>
        )}
      </div>
    </Link>
  );
}
