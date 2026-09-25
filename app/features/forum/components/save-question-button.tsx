import { useRef } from "react";
import { Bookmark } from "lucide-react";
import { Link, useFetcher, useLocation } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { useFetcherOutcome } from "~/hooks/use-fetcher-outcome";
import { cn } from "~/lib/utils";
import type { QuestionResponse } from "~/types/api-client";

interface SaveQuestionButtonProps {
  question: Pick<QuestionResponse, "id" | "viewerSave">;
  isAuthenticated?: boolean;
  iconOnly?: boolean;
  className?: string;
}

const BUTTON_CLASS =
  "group h-8 cursor-pointer gap-1.5 bg-transparent px-2 text-sm font-semibold text-[#595c5e] transition-colors hover:bg-[#f1f5f9] hover:text-blue-500";

export default function SaveQuestionButton({
  question,
  isAuthenticated = false,
  iconOnly = false,
  className,
}: SaveQuestionButtonProps) {
  const location = useLocation();
  const fetcher = useFetcher();
  const submittedIntent = useRef<string | null>(null);
  const isSubmitting = fetcher.state !== "idle";
  const isSaved = Boolean(question.viewerSave);

  useFetcherOutcome(fetcher, {
    onSuccess: () => {
      toast.success(
        submittedIntent.current === "save-question"
          ? "Question saved"
          : "Question unsaved",
      );
      submittedIntent.current = null;
    },
    onError: (message) => toast.error(message ?? "Failed to save question."),
  });

  if (!isAuthenticated) {
    const loginHref = `/login?redirectTo=${encodeURIComponent(
      `${location.pathname}${location.search}`,
    )}`;

    return (
      <Button asChild className={cn(BUTTON_CLASS, className)}>
        <Link to={loginHref} aria-label="Save question">
          <Bookmark className="size-4 transition-colors group-hover:text-blue-500" />
          {!iconOnly && "Save"}
        </Link>
      </Button>
    );
  }

  const handleSave = () => {
    const actionType = isSaved ? "unsave-question" : "save-question";
    submittedIntent.current = actionType;
    fetcher.submit(
      { actionType, questionId: question.id },
      { method: "post", action: `/forum/detail/${question.id}` },
    );
  };

  return (
    <Button
      type="button"
      onClick={handleSave}
      disabled={isSubmitting}
      aria-pressed={isSaved}
      aria-label={isSaved ? "Unsave question" : "Save question"}
      className={cn(BUTTON_CLASS, isSaved && "text-blue-500", className)}
    >
      {isSubmitting ? (
        <Spinner className="size-3.5" />
      ) : (
        <Bookmark
          className={cn(
            "size-4 transition-colors group-hover:text-blue-500",
            isSaved && "fill-blue-500",
          )}
        />
      )}
      {/* {!iconOnly && (isSaved ? "Saved" : "Save")} */}
    </Button>
  );
}
