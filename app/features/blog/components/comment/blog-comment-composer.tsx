import { useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { Textarea } from "~/components/ui/textarea";
import { useFetcherOutcome } from "~/hooks/use-fetcher-outcome";
import { cn } from "~/lib/utils";
import { BLOG_COMMENT_ACTIONS, type BlogCommentViewer } from "../../types";
import BlogCommentAvatar from "./blog-comment-avatar";
import BlogCommentSignInPrompt from "./blog-comment-sign-in-prompt";

const BODY_MAX_LENGTH = 10000;

interface BlogCommentComposerProps {
  postId: string;
  viewer: BlogCommentViewer | null;
  /** Set to reply under a top-level comment. */
  replyToComment?: string;
  /** Set to edit an existing comment instead of creating one. */
  commentId?: string;
  defaultValue?: string;
  placeholder?: string;
  submitLabel?: string;
  withAvatar?: boolean;
  autoFocus?: boolean;
  className?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function BlogCommentComposer({
  postId,
  viewer,
  replyToComment,
  commentId,
  defaultValue = "",
  placeholder = "Share your thoughts...",
  submitLabel = "Comment",
  withAvatar = true,
  autoFocus = false,
  className,
  onCancel,
  onSuccess,
}: BlogCommentComposerProps) {
  const fetcher = useFetcher();
  const [body, setBody] = useState(defaultValue);
  const isSubmitting = fetcher.state !== "idle";
  const isEmpty = body.trim().length === 0;

  useFetcherOutcome(fetcher, {
    onSuccess: (message) => {
      setBody(commentId ? body : "");
      toast.success(message ?? "Comment posted.");
      onSuccess?.();
    },
    onError: (message) => toast.error(message ?? "Failed to post comment."),
  });

  if (!viewer) return <BlogCommentSignInPrompt />;

  return (
    <div className={cn("flex items-start gap-4", className)}>
      {withAvatar ? (
        <BlogCommentAvatar name={viewer.name} avatarKey={viewer.avatarKey} />
      ) : null}

      <fetcher.Form method="post" className="min-w-0 flex-1">
        <input
          type="hidden"
          name="actionType"
          value={
            commentId
              ? BLOG_COMMENT_ACTIONS.update
              : BLOG_COMMENT_ACTIONS.create
          }
        />
        <input type="hidden" name="postId" value={postId} />
        {commentId ? (
          <input type="hidden" name="commentId" value={commentId} />
        ) : null}
        {replyToComment ? (
          <input type="hidden" name="replyToComment" value={replyToComment} />
        ) : null}

        <Textarea
          name="body"
          value={body}
          autoFocus={autoFocus}
          disabled={isSubmitting}
          maxLength={BODY_MAX_LENGTH}
          placeholder={placeholder}
          onChange={(event) => setBody(event.target.value)}
          className="min-h-[92px] w-full resize-y rounded-xl border-slate-200 bg-white px-4 py-3 text-[14px] leading-6 text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#0082e1]/20 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
        />

        <div className="mt-3 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            disabled={isSubmitting}
            onClick={() => (onCancel ? onCancel() : setBody(""))}
            className="h-10 rounded-full px-5 text-[13px] font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/5"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isEmpty || isSubmitting}
            className="h-10 rounded-full bg-[#0082e1] px-6 text-[13px] font-semibold text-white hover:bg-[#0069b6] disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:bg-white/5"
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
  );
}
