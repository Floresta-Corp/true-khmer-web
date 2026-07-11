import { ChevronDown, ChevronUp } from "lucide-react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { ViewerVote } from "~/services/types";
import { cn } from "~/lib/utils";
import { useFetcherOutcome } from "~/hooks/use-fetcher-outcome";

interface AnswerVoteComponentProps {
  answerId: string;
  score: number;
  viewerVote?: ViewerVote | null;
  className?: string;
}

export default function AnswerVoteComponent({
  answerId,
  score,
  viewerVote = ViewerVote.NONE,
  className,
}: AnswerVoteComponentProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";

  useFetcherOutcome(fetcher, {
    onError: (message) => toast.error(message ?? "Failed to submit vote."),
  });

  // Optimistic state: while a vote is in flight, trust the intent we just
  // submitted instead of the (stale) prop. Reads straight from the fetcher,
  // so the buttons update on click without waiting for the parent to
  // re-render — no useEffect, no revalidation dependency, no loop risk.
  const serverVote = viewerVote ?? ViewerVote.NONE;
  const pendingVote = fetcher.formData?.get("voteType") as
    | ViewerVote
    | undefined;
  const currentVote = pendingVote ?? serverVote;

  const voteValue = (v: ViewerVote) =>
    v === ViewerVote.UPVOTE ? 1 : v === ViewerVote.DOWNVOTE ? -1 : 0;

  const displayScore = score + voteValue(currentVote) - voteValue(serverVote);

  const isUpvoteActive = currentVote === ViewerVote.UPVOTE;
  const isDownvoteActive = currentVote === ViewerVote.DOWNVOTE;

  const upvoteIntent =
    currentVote === ViewerVote.UPVOTE ? ViewerVote.NONE : ViewerVote.UPVOTE;
  const downvoteIntent =
    currentVote === ViewerVote.DOWNVOTE ? ViewerVote.NONE : ViewerVote.DOWNVOTE;

  const scoreClassName = isUpvoteActive
    ? "text-[#009966]"
    : isDownvoteActive
      ? "text-[#E7000B]"
      : "text-[#4a5565]";

  const upvoteClassName = isUpvoteActive
    ? "bg-[#ECFDF5] text-[#009966] hover:bg-[#ECFDF5] hover:text-[#009966]"
    : "hover:bg-[#ECFDF5] hover:text-[#009966]";

  const downvoteClassName = isDownvoteActive
    ? "bg-[#FEF2F2] text-[#E7000B] hover:bg-[#FEF2F2] hover:text-[#FF2631]"
    : "hover:bg-[#FEF2F2] hover:text-[#FF2631]";

  const handleUpvote = () => {
    fetcher.submit(
      { actionType: "vote-answer", answerId, voteType: upvoteIntent },
      { method: "post" },
    );
  };

  const handleDownvote = () => {
    fetcher.submit(
      { actionType: "vote-answer", answerId, voteType: downvoteIntent },
      { method: "post" },
    );
  };

  return (
    <div
      className={cn(
        "flex h-fit bg-[#f9fafb] shrink-0 flex-col items-center gap-[5.25px] text-[#99a1af] pt-[3.5px] rounded-xl overflow-hidden transition-all",
        className,
      )}
    >
      <Button
        type="button"
        variant="ghost"
        className={cn(
          `flex h-7 w-7 items-center cursor-pointer justify-center rounded-none`,
          upvoteClassName,
        )}
        disabled={isSubmitting}
        onClick={handleUpvote}
        aria-label="Up vote answer"
      >
        <ChevronUp className="h-3.5 w-3.5" />
      </Button>

      <span
        className={cn(
          `text-[11px] font-semibold leading-[16.5px] mx-1`,
          scoreClassName,
        )}
      >
        {displayScore}
      </span>

      <Button
        type="button"
        variant="ghost"
        disabled={isSubmitting}
        className={cn(
          `flex h-7 w-7 items-center cursor-pointer justify-center rounded-none`,
          downvoteClassName,
        )}
        onClick={handleDownvote}
        aria-label="Down vote answer"
      >
        <ChevronDown className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
