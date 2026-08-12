import { cn } from "~/lib/utils";
import type { ForumAnswerModerationHandlers, RepliedAnswer } from "../../types";
import DeleteForumAnswerDialog from "./delete-forum-answer-dialog";
import ForumAuthorLine from "./forum-author-line";
import { SuspendedBadge, SuspendedNotice } from "./forum-suspension-indicators";
import ForumVoteBreakdown from "./forum-vote-breakdown";
import SuspendForumPostDialog from "./suspend-forum-post-dialog";

interface ManageForumReplyRowProps extends ForumAnswerModerationHandlers {
  reply: RepliedAnswer;
  questionAuthorId: string;
}

export default function ManageForumReplyRow({
  reply,
  questionAuthorId,
  onDelete,
  onSuspend,
  onUnsuspend,
  isDeleting,
}: ManageForumReplyRowProps) {
  const isSuspended = reply.status === "SUSPENDED";

  return (
    <div className="relative pl-6">
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 h-5 w-4 rounded-bl-lg border-b border-l border-slate-200 dark:border-slate-800"
      />
      <div
        className={cn(
          "rounded-xl border p-3.5",
          isSuspended
            ? "border-orange-200 bg-orange-50/40 dark:border-orange-500/30 dark:bg-orange-500/5"
            : "border-slate-200/70 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/50",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <ForumAuthorLine
              author={reply.author}
              createdAt={reply.createdAt}
              isQuestionAuthor={reply.author.id === questionAuthorId}
              size="sm"
            />
            {isSuspended && <SuspendedBadge />}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <SuspendForumPostDialog
              postId={reply.id}
              postLabel={reply.author.name}
              noun="reply"
              suspended={isSuspended}
              onSuspend={(id, reason) => onSuspend(id, reason, true)}
              onUnsuspend={(id) => onUnsuspend(id, true)}
              disabled={isDeleting}
              className="size-7"
            />
            <DeleteForumAnswerDialog
              answerId={reply.id}
              authorName={reply.author.name}
              isReply
              onConfirm={onDelete}
              disabled={isDeleting}
              className="size-7"
            />
          </div>
        </div>

        {isSuspended && <SuspendedNotice reason={reply.suspensionReason} />}

        <p className="mt-2 text-sm leading-6 whitespace-pre-line text-slate-600 dark:text-slate-300">
          {reply.body}
        </p>

        <div className="mt-2.5">
          <ForumVoteBreakdown
            upvoteCount={reply.upvoteCount}
            downvoteCount={reply.downvoteCount}
            score={reply.score}
          />
        </div>
      </div>
    </div>
  );
}
