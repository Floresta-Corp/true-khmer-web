import { Link } from "react-router";
import type { Question } from "~/services/forum/forum-types";

interface RelatedDiscussionsCardProps {
  discussions: Question[];
  maxItems?: number;
}

export default function RelatedDiscussionsCard({
  discussions,
  maxItems = 3,
}: RelatedDiscussionsCardProps) {
  const displayedDiscussions = discussions.slice(0, maxItems);

  return (
    <div className="flex flex-col gap-3.5 rounded-xl border border-[#e1e7ef] bg-white p-5.5">
      {/* Heading */}
      <h3 className="text-sm font-bold leading-5.25 text-[#2c2f31] tracking-tight">
        Related Discussions
      </h3>

      {/* Discussion list */}
      <div className="flex flex-col gap-3.5">
        {displayedDiscussions.map((discussion) => (
          <Link
            key={discussion.id}
            to={`/forum/${discussion.id}`}
            className="group flex flex-col gap-2 hover:opacity-80 transition-opacity"
          >
            {/* Title */}
            <p className="text-[12.25px] font-bold leading-4.375 text-[#2c2f31] line-clamp-2">
              {discussion.title}
            </p>
            {/* Answer count */}
            <p className="text-[10.5px] font-bold leading-3.5 text-[#99a1af] tracking-wider">
              {discussion.answerCount}{" "}
              {discussion.answerCount === 1 ? "answer" : "answers"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
