import { useState } from "react";
import { useLoaderData } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card } from "~/components/ui/card";
import ProfileLinkWrapper from "~/components/profile-link-wrapper";
import { resolveImageURL } from "~/lib/utils";
import type { forumListloader } from "../../services/forum.loader";

const COLLAPSED_COUNT = 3;

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function formatCompactCount(count: number) {
  if (count < 1000) {
    return String(count);
  }

  const thousands = count / 1000;
  const rounded =
    thousands >= 10 ? Math.round(thousands) : Math.round(thousands * 10) / 10;

  return `${rounded}k`;
}

export default function TopContributorsCard() {
  const { topContributors, userId } = useLoaderData<typeof forumListloader>();
  const [showAll, setShowAll] = useState(false);

  if (topContributors.length === 0) {
    return null;
  }

  const contributors = showAll
    ? topContributors
    : topContributors.slice(0, COLLAPSED_COUNT);
  const canToggle = topContributors.length > COLLAPSED_COUNT;

  return (
    <Card className="w-full gap-0 rounded-2xl border border-[#e9eef5] bg-white p-5 shadow-none">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-base leading-6 font-bold text-[#0f1729]">
          Top Contributors
        </h3>
        {canToggle && (
          <button
            type="button"
            onClick={() => setShowAll((current) => !current)}
            className="cursor-pointer text-xs font-semibold text-[#2f6fe4] transition-colors hover:text-[#1f62df]"
          >
            {showAll ? "Show less" : "View all"}
          </button>
        )}
      </div>

      <ol className="flex flex-col gap-3.5">
        {contributors.map((contributor, index) => (
          <li key={contributor.id}>
            <ProfileLinkWrapper
              authorId={contributor.id}
              isAuthor={contributor.id === userId}
              className="group flex items-center gap-3 hover:no-underline"
            >
              <Avatar className="size-9 shrink-0">
                <AvatarImage
                  src={resolveImageURL(contributor.avatarKey)}
                  alt={contributor.name}
                />
                <AvatarFallback className="bg-[#2f6fe4] text-xs font-semibold text-white">
                  {getInitials(contributor.name)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#0f1729] group-hover:text-[#2f6fe4] group-hover:underline">
                  {contributor.name}
                </p>
                <p className="truncate text-xs text-[#9eacc0]">
                  {formatCompactCount(contributor.answerCount)} answered •{" "}
                  {formatCompactCount(contributor.voteCount)} votes
                </p>
              </div>

              <span className="shrink-0 text-xs font-semibold text-[#9eacc0]">
                #{index + 1}
              </span>
            </ProfileLinkWrapper>
          </li>
        ))}
      </ol>
    </Card>
  );
}
