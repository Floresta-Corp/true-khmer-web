import { useState } from "react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Card } from "~/components/ui/card";

interface TopContributor {
  name: string;
  answered: string;
  votes: string;
  avatarClassName: string;
}

const TOP_CONTRIBUTORS: TopContributor[] = [
  {
    name: "Arjun Mehta",
    answered: "2.4k answered",
    votes: "120 votes",
    avatarClassName: "bg-[#dbe6ff] text-[#2f6fe4]",
  },
  {
    name: "Sarah Chen",
    answered: "1.2k answered",
    votes: "85 votes",
    avatarClassName: "bg-[#d8f3e5] text-[#1fc16b]",
  },
  {
    name: "Marcus Thorne",
    answered: "50 answered",
    votes: "42 votes",
    avatarClassName: "bg-[#ffe8d6] text-[#e07b39]",
  },
  {
    name: "Lina Sok",
    answered: "38 answered",
    votes: "31 votes",
    avatarClassName: "bg-[#ede0ff] text-[#7c4dff]",
  },
  {
    name: "Vichea Norng",
    answered: "24 answered",
    votes: "19 votes",
    avatarClassName: "bg-[#ffe0e6] text-[#e7398b]",
  },
];

const COLLAPSED_COUNT = 3;

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default function TopContributorsCard() {
  const [showAll, setShowAll] = useState(false);
  const contributors = showAll
    ? TOP_CONTRIBUTORS
    : TOP_CONTRIBUTORS.slice(0, COLLAPSED_COUNT);

  return (
    <Card className="w-full gap-0 rounded-2xl border border-[#e9eef5] bg-white p-5 shadow-none">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-base leading-6 font-bold text-[#0f1729]">
          Top Contributors
        </h3>
        <button
          type="button"
          onClick={() => setShowAll((current) => !current)}
          className="cursor-pointer text-xs font-semibold text-[#2f6fe4] transition-colors hover:text-[#1f62df]"
        >
          {showAll ? "Show less" : "View all"}
        </button>
      </div>

      <ol className="flex flex-col gap-3.5">
        {contributors.map((contributor, index) => (
          <li key={contributor.name} className="flex items-center gap-3">
            <Avatar className="size-9 shrink-0">
              <AvatarFallback
                className={`text-xs font-semibold ${contributor.avatarClassName}`}
              >
                {getInitials(contributor.name)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#0f1729]">
                {contributor.name}
              </p>
              <p className="truncate text-xs text-[#9eacc0]">
                {contributor.answered} • {contributor.votes}
              </p>
            </div>

            <span className="shrink-0 text-xs font-semibold text-[#9eacc0]">
              #{index + 1}
            </span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
