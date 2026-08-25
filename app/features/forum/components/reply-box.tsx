import { useState } from "react";
import { useFetcher, useRevalidator } from "react-router";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Spinner } from "~/components/ui/spinner";
import { cn } from "~/lib/utils";
import type { QuestionResponse } from "~/types/api-client";
import { useFetcherOutcome } from "~/hooks/use-fetcher-outcome";

export interface ReplyBoxProps {
  /**
   * Placeholder text for the textarea.
   */
  placeholder?: string;
  /**
   * If true, disables input and actions.
   */
  disabled?: boolean;
  /**
   * Optional className applied to the root container.
   */
  className?: string;
  /**
   * Maximum allowed characters. When provided, a counter is shown.
   */
  maxLength?: number;
  /**
   * Label for the submit button.
   */
  submitLabel?: string;
  /**
   * The question the reply belongs to (required by CreateAnswerInputSchema).
   */
  question: QuestionResponse;
}

export default function ReplyBox({
  placeholder = "Add a reply...",
  disabled = false,
  className,
  maxLength,
  submitLabel = "Reply",
  question,
}: ReplyBoxProps) {
  const fetcher = useFetcher();
  const revalidator = useRevalidator();
  const [body, setBody] = useState("");
  const isSubmitting = fetcher.state !== "idle";
  const isBodyEmpty = body.trim().length === 0;

  useFetcherOutcome(fetcher, {
    onSuccess: () => {
      setBody("");
      revalidator.revalidate();
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (isBodyEmpty) {
      event.preventDefault();
    }
  };

  if (!question) return null;

  return (
    <div className={cn("rounded-xl bg-[#EEF1F3] p-3", className)}>
      <div className="relative overflow-hidden rounded-xl border border-[#f1f5f9] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05),0px_0px_0px_1px_rgba(171,173,175,0.1)]">
        <fetcher.Form
          method="post"
          className="relative w-full"
          onSubmit={handleSubmit}
        >
          {/* Server expects these per CreateAnswerInputSchema */}
          <input type="hidden" name="actionType" value="create-answer" />
          <input type="hidden" name="questionId" value={question.id} />

          {/* Textarea area. Add bottom padding so overlay doesn't overlap content */}
          <div className="w-full p-4">
            <Textarea
              name="body"
              placeholder={placeholder}
              disabled={disabled || isSubmitting}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              className="min-h-24 w-full rounded-md border border-[#e6eef8] bg-white px-3 py-2 text-sm leading-5 text-[#111827] placeholder:text-muted-foreground focus:ring-2 focus:ring-[#2f6fe4]/20 focus:outline-none"
              maxLength={maxLength}
            />
          </div>

          <div className="w-full bg-[#EEF1F34D] p-4 text-right">
            <Button
              type="submit"
              disabled={disabled || isSubmitting || isBodyEmpty}
              className="h-10 rounded-lg bg-[#2f6fe4] text-sm font-medium text-white hover:bg-[#245fca] disabled:opacity-60 md:w-30"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner className="size-3.5" />
                  Posting...
                </span>
              ) : (
                submitLabel
              )}
            </Button>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}
