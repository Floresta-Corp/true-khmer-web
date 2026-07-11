import { ChevronDown, ChevronUp } from "lucide-react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { ViewerVote } from "~/services/types";
import type { QuestionResponse } from "~/types/api-client";
import { useFetcherOutcome } from "~/hooks/use-fetcher-outcome";

interface QuestionVoteComponentProps {
  question: QuestionResponse;
  className?: string;
}

export default function QuestionVoteComponent({
  question,
  className,
}: QuestionVoteComponentProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";

  useFetcherOutcome(fetcher, {
    onError: (message) => toast.error(message ?? "Failed to submit vote."),
  });

  // Optimistic state: while a vote is in flight, trust the intent we just
  // submitted instead of the (stale) prop. Reads straight from the fetcher,
  // so the buttons update on click without waiting for the parent to
  // re-render — no useEffect, no revalidation dependency, no loop risk.
  const serverVote = question?.viewerVote ?? ViewerVote.NONE;
  const pendingVote = fetcher.formData?.get("voteType") as
    | ViewerVote
    | undefined;
  const currentVote = pendingVote ?? serverVote;

  const voteValue = (v: ViewerVote) =>
    v === ViewerVote.UPVOTE ? 1 : v === ViewerVote.DOWNVOTE ? -1 : 0;

  const displayScore =
    (question?.score ?? 0) + voteValue(currentVote) - voteValue(serverVote);

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
    : "bg-transparent text-[#99a1af] hover:bg-[#ECFDF5] hover:text-[#009966]";

  const downvoteClassName = isDownvoteActive
    ? "bg-[#FEF2F2] text-[#E7000B] hover:bg-[#FEF2F2] hover:text-[#FF2631]"
    : "bg-transparent text-[#99a1af] hover:bg-[#FEF2F2] hover:text-[#FF2631]";

  const handleUpvote = () => {
    if (!question) return;
    fetcher.submit(
      {
        actionType: "vote-question",
        questionId: question.id,
        voteType: upvoteIntent,
      },
      { method: "post" },
    );
  };

  const handleDownvote = () => {
    if (!question) return;
    fetcher.submit(
      {
        actionType: "vote-question",
        questionId: question.id,
        voteType: downvoteIntent,
      },
      { method: "post" },
    );
  };

  if (!question) return null;

  return (
    <div
      className={`flex h-fit items-center overflow-hidden rounded-xl bg-[#f9fafb] text-[#4a5565] ${className ?? ""}`}
    >
      <Button
        type="button"
        variant="ghost"
        className={`h-7 w-7 cursor-pointer rounded-none ${upvoteClassName}`}
        disabled={isSubmitting}
        onClick={handleUpvote}
        aria-label="Up vote"
      >
        <ChevronUp className="h-3.5 w-3.5" />
      </Button>

      <span className={`px-2 text-xs font-semibold ${scoreClassName}`}>
        {displayScore}
      </span>
      <Button
        type="button"
        variant="ghost"
        disabled={isSubmitting}
        className={`h-7 w-7 cursor-pointer rounded-none ${downvoteClassName}`}
        onClick={handleDownvote}
        aria-label="Down vote"
      >
        <ChevronDown className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
