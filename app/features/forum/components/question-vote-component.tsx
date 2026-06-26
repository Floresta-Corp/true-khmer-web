import { useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { ViewerVote } from "~/services/types";
import type { QuestionResponse } from "~/types/api-client";

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
  const wasSubmitting = useRef(false);

  useEffect(() => {
    if (fetcher.state === "submitting") {
      wasSubmitting.current = true;
    }

    if (wasSubmitting.current && fetcher.state === "idle" && fetcher.data) {
      wasSubmitting.current = false;

      const result = fetcher.data as
        | { ok?: boolean; message?: string; error?: string }
        | { data?: { ok?: boolean }; message?: string; error?: string };

      const isSuccess =
        ("ok" in result && result.ok === true) ||
        ("data" in result && result.data?.ok === true);
      if (!isSuccess) {
        toast.error(
          result?.message ?? result?.error ?? "Failed to submit vote.",
        );
      }
    }
  }, [fetcher.state, fetcher.data]);

  const isUpvoteActive = question?.viewerVote === ViewerVote.UPVOTE;
  const isDownvoteActive = question?.viewerVote === ViewerVote.DOWNVOTE;

  const upvoteIntent =
    question?.viewerVote === ViewerVote.UPVOTE
      ? ViewerVote.NONE
      : ViewerVote.UPVOTE;
  const downvoteIntent =
    question?.viewerVote === ViewerVote.DOWNVOTE
      ? ViewerVote.NONE
      : ViewerVote.DOWNVOTE;

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
      className={`flex h-fit items-center rounded-xl overflow-hidden bg-[#f9fafb] text-[#4a5565] ${className ?? ""}`}
    >
      <Button
        type="button"
        variant="ghost"
        className={`cursor-pointer h-7 w-7 rounded-none ${upvoteClassName}`}
        disabled={isSubmitting}
        onClick={handleUpvote}
        aria-label="Up vote"
      >
        <ChevronUp className="h-3.5 w-3.5" />
      </Button>

      {isSubmitting ? (
        <Spinner className="mx-1 size-3" />
      ) : (
        <span className={`px-2 text-xs font-semibold ${scoreClassName}`}>
          {question.score}
        </span>
      )}
      <Button
        type="button"
        variant="ghost"
        disabled={isSubmitting}
        className={`cursor-pointer h-7 w-7 rounded-none ${downvoteClassName}`}
        onClick={handleDownvote}
        aria-label="Down vote"
      >
        <ChevronDown className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
