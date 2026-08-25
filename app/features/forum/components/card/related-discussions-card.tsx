import { Link } from "react-router";
import type { QuestionResponse } from "~/types/api-client";

interface RelatedDiscussionsCardProps {
  discussions: QuestionResponse[];
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
      <h3 className="text-sm leading-5.25 font-bold tracking-tight text-[#2c2f31]">
        Related Discussions
      </h3>

      {/* Discussion list */}
      <div className="flex flex-col gap-3.5">
        {displayedDiscussions.map((discussion) => (
          <Link
            key={discussion.id}
            to={`/forum/${discussion.id}`}
            className="group flex flex-col gap-2 transition-opacity hover:opacity-80"
          >
            {/* Title */}
            <p className="leading-4.375 line-clamp-2 text-[12.25px] font-bold text-[#2c2f31]">
              {discussion.title}
            </p>
            {/* Answer count */}
            <p className="text-[10.5px] leading-3.5 font-bold tracking-wider text-[#99a1af]">
              {discussion.answerCount}{" "}
              {discussion.answerCount === 1 ? "answer" : "answers"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
