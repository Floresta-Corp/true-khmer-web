import { Link } from "react-router";
import { Avatar } from "~/components/ui/avatar";
import type { VolunteerOpportunityResponse } from "~/types/api-client";

interface HomeLaunchpadSectionProps {
  opportunity: VolunteerOpportunityResponse;
}

export default function HomeLaunchpadSection({
  opportunity,
}: HomeLaunchpadSectionProps) {
  const detailPath = `/launchpad/detail/${opportunity.id}`;
  return (
    <>
      <article className="group flex cursor-pointer items-center gap-3 rounded-xl border border-[#e1e7ef] bg-white px-4 py-3.5 transition-colors hover:border-[#2f6fe4] sm:gap-4 sm:px-5">
        {/* <Avatar className="size-9 shrink-0 sm:size-10">
          <AvatarImage
            src={avatar}
            alt={question.author.name}
            className="object-cover"
          />
          <AvatarFallback className="bg-[#1c5dd4] text-xs font-semibold text-white">
            {getInitials(question.author.name)}
          </AvatarFallback>
        </Avatar> */}

        <div className="flex min-w-0 flex-col gap-1">
          <Link to={detailPath} className="block">
            <h3 className="truncate text-sm font-bold text-[#1e293b] transition-colors group-hover:text-[#1c5dd4] sm:text-base">
              {opportunity.category.name}
            </h3>
          </Link>

          <p className="flex min-w-0 items-center gap-1 truncate text-xs text-[#595c5e] sm:text-sm">
            {/* <ProfileLinkWrapper
              authorId={question.author.id}
              className="truncate font-medium text-[#2c2f31] hover:text-[#1c5dd4]"
            >
              {question.author.name}
            </ProfileLinkWrapper> */}
            <div>{opportunity.title}</div>
            <span className="shrink-0">in</span>
            {/* <Link
              to={`/forum?categoryId=${question.category.id}`}
              className="truncate font-semibold text-[#1c5dd4]"
            >
              {question.category.name}
            </Link> */}
            <span className="shrink-0 text-[#99a1af]">·</span>
            <span className="shrink-0">{opportunity.filled} </span>
          </p>
        </div>
      </article>
    </>
  );
}
