import { useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { ViewerVote } from "~/services/forum/types";
import { cn } from "~/lib/utils";

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

  const isUpvoteActive = viewerVote === ViewerVote.UPVOTE;
  const isDownvoteActive = viewerVote === ViewerVote.DOWNVOTE;

  const upvoteIntent =
    viewerVote === ViewerVote.UPVOTE ? ViewerVote.NONE : ViewerVote.UPVOTE;
  const downvoteIntent =
    viewerVote === ViewerVote.DOWNVOTE ? ViewerVote.NONE : ViewerVote.DOWNVOTE;

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

  return (
    <div
      className={cn(
        "flex w-7 shrink-0 flex-col items-center gap-[5.25px] pt-[3.5px]",
        className,
      )}
    >
      <fetcher.Form method="post">
        <input type="hidden" name="actionType" value="vote-answer" />
        <input type="hidden" name="answerId" value={answerId} />
        <input type="hidden" name="voteType" value={upvoteIntent} />
        <Button
          type="submit"
          variant="ghost"
          className={cn(
            `flex h-7 w-7 items-center justify-center rounded-xl border border-[#f3f4f6] transition-colors`,
            upvoteClassName,
          )}
          disabled={isSubmitting}
          aria-label="Up vote answer"
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </Button>
      </fetcher.Form>

      {isSubmitting ? (
        <Spinner className="mx-1 size-3" />
      ) : (
        <span
          className={cn(
            `text-[11px] font-semibold leading-[16.5px]`,
            scoreClassName,
          )}
        >
          {score}
        </span>
      )}

      <fetcher.Form method="post">
        <input type="hidden" name="actionType" value="vote-answer" />
        <input type="hidden" name="answerId" value={answerId} />
        <input type="hidden" name="voteType" value={downvoteIntent} />
        <Button
          type="submit"
          variant="ghost"
          disabled={isSubmitting}
          className={cn(
            `flex h-7 w-7 items-center justify-center rounded-xl border border-[#f3f4f6] transition-colors`,
            downvoteClassName,
          )}
          aria-label="Down vote answer"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </fetcher.Form>
    </div>
  );
}
