import { ThumbsDown, ThumbsUp } from "lucide-react";

import { cn } from "~/lib/utils";

interface ForumVoteBreakdownProps {
  upvoteCount: number;
  downvoteCount: number;
  score: number;
}

export default function ForumVoteBreakdown({
  upvoteCount,
  downvoteCount,
  score,
}: ForumVoteBreakdownProps) {
  return (
    <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-lg px-2 py-1 tabular-nums",
          score > 0 &&
            "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
          score < 0 &&
            "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
          score === 0 && "bg-slate-100 dark:bg-slate-800",
        )}
        title={`Score ${score}`}
      >
        {score > 0 ? `+${score}` : score}
      </span>
      <span className="inline-flex items-center gap-1 tabular-nums">
        <ThumbsUp size={13} />
        {upvoteCount}
      </span>
      <span className="inline-flex items-center gap-1 tabular-nums">
        <ThumbsDown size={13} />
        {downvoteCount}
      </span>
    </div>
  );
}
