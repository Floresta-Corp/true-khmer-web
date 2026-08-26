import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { resolveImageURL } from "~/lib/utils";

interface Contributor {
  name: string;
  avatar: string;
  points: number;
}

interface ForumRightSidebarProps {
  contributors?: Contributor[];
  guidelines?: string[];
  hideGuidelines?: boolean;
}

const fallbackBgClasses = [
  "bg-slate-700",
  "bg-blue-700",
  "bg-indigo-700",
  "bg-emerald-700",
  "bg-rose-700",
  "bg-amber-700",
];

function getFallbackBgClass(name: string) {
  const hash = Array.from(name).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0,
  );

  return fallbackBgClasses[hash % fallbackBgClasses.length];
}

export default function ForumRightSidebar({
  contributors = [
    {
      name: "Virak Hou",
      avatar:
        "http://localhost:3845/assets/77666d26801f7bbe2c1c174a2f3612979db8e4f4.png",
      points: 256,
    },
    {
      name: "Sophea Rath",
      avatar:
        "http://localhost:3845/assets/8befcb6610611323e87966c7d635c0e3edd12197.png",
      points: 189,
    },
    {
      name: "Dara Samnang",
      avatar:
        "http://localhost:3845/assets/8befcb6610611323e87966c7d635c0e3edd12197.png",
      points: 145,
    },
    {
      name: "Long Vannak",
      avatar:
        "http://localhost:3845/assets/84deebc9464283edd8955ce95d024a9432e91489.png",
      points: 128,
    },
    {
      name: "Chanravy K.",
      avatar:
        "http://localhost:3845/assets/8befcb6610611323e87966c7d635c0e3edd12197.png",
      points: 112,
    },
  ],
  guidelines = [
    "Be professional and respectful to all members.",
    "No self-promotion or spamming.",
    "Help others before asking for help.",
  ],
  hideGuidelines = false,
}: ForumRightSidebarProps) {
  return (
    <div className="flex max-w-sm flex-col gap-5">
      {/* Top Contributors */}
      {/* <Card className="bg-white border shadow-none rounded-2xl p-5 w-full">
        <h3 className="font-bold text-lg leading-6.75 text-[#344256] mb-4 flex items-center gap-2">
          <span className="text-lg">⭐</span>
          Top Contributors
        </h3>

        <div className="flex flex-col gap-4">
          {contributors.map((contributor) => (
            <div
              key={contributor.name}
              className="flex items-center gap-3 hover:bg-[#f8fafc] rounded-lg p-2 transition-colors cursor-pointer"
            >
              <Avatar className="border border-[#f3f4f6]">
                <AvatarImage
                  src={resolveImageURL(contributor.avatar)}
                  alt={contributor.name}
                />
                <AvatarFallback
                  className={`${getFallbackBgClass(contributor.name)} text-white text-sm font-semibold`}
                >
                  {contributor.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#344256] truncate">
                  {contributor.name}
                </p>
                <p className="text-xs text-[#9eacc0]">
                  {contributor.points.toLocaleString()} Points
                </p>
              </div>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="ghost"
          className="mt-4 h-11.5 w-full rounded-xl border border-[rgba(171,173,175,0.2)] px-px py-3.25 text-sm font-semibold leading-5 text-[#595c5e] hover:bg-[#f8fafc]"
        >
          View all top 10
        </Button>
      </Card> */}

      {/* Community Guidelines */}
      {!hideGuidelines && (
        <Card className="w-full rounded-2xl border bg-white p-5 shadow-none">
          <h3 className="mb-4 text-lg leading-6.75 font-bold text-[#344256]">
            Community Guidelines
          </h3>

          <ol className="flex flex-col gap-3">
            {guidelines.map((guideline, index) => (
              <li
                key={index}
                className="flex gap-3 text-sm leading-6 text-[#65758b]"
              >
                <span className="shrink-0 font-semibold text-[#344256]">
                  {index + 1}.
                </span>
                <span>{guideline}</span>
              </li>
            ))}
          </ol>
        </Card>
      )}
    </div>
  );
}
