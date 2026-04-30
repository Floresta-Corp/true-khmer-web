import React, { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Spinner } from "~/components/ui/spinner";
import { cn } from "~/lib/utils";
import type { Question } from "~/services/forum/forum-types";

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
  question: Question;
}

export default function ReplyBox({
  placeholder = "Add a reply...",
  disabled = false,
  className,
  maxLength,
  submitLabel = "Reply",
  question,
}: ReplyBoxProps) {
  if (!question) return null;

  const fetcher = useFetcher();
  const wasSubmitting = useRef(false);
  const [body, setBody] = useState("");
  const isSubmitting = fetcher.state !== "idle";
  const isBodyEmpty = body.trim().length === 0;

  // Watch fetcher for outcome and reset/propagate accordingly
  useEffect(() => {
    if (fetcher.state === "submitting") {
      wasSubmitting.current = true;
    }

    if (wasSubmitting.current && fetcher.state === "idle" && fetcher.data) {
      wasSubmitting.current = false;

      // server responses in this app typically return { ok: boolean, ... } or { data: { ok: boolean } }
      const result =
        (fetcher.data as any)?.data ?? (fetcher.data as any) ?? null;

      const isSuccess =
        (result && typeof result.ok === "boolean" && result.ok === true) ||
        (result && result.data && result.data.ok === true);

      if (isSuccess) {
        setBody("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (isBodyEmpty) {
      event.preventDefault();
    }
  };

  return (
    <div className={cn("rounded-xl bg-[#EEF1F3] p-3", className)}>
      <div className="relative rounded-xl bg-white border border-[#f1f5f9] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05),0px_0px_0px_1px_rgba(171,173,175,0.1)] overflow-hidden">
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
              className="min-h-24 w-full rounded-md border border-[#e6eef8] bg-white px-3 py-2 text-sm leading-5 text-[#111827] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2f6fe4]/20"
              maxLength={maxLength}
            />
          </div>

          <div className="p-4 bg-[#EEF1F34D] w-full text-right">
            <Button
              type="submit"
              disabled={disabled || isSubmitting || isBodyEmpty}
              className="h-10 md:w-30 rounded-lg bg-[#2f6fe4] text-sm font-medium text-white hover:bg-[#245fca] disabled:opacity-60"
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
