import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Award, ChevronDown, MessageCircle } from "lucide-react";

import { cn } from "~/lib/utils";
import type { AnswerResponse } from "~/types/api-client";
import type { ForumAnswerModerationHandlers } from "../../types";
import DeleteForumAnswerDialog from "./delete-forum-answer-dialog";
import ForumAuthorLine from "./forum-author-line";
import { SuspendedBadge, SuspendedNotice } from "./forum-suspension-indicators";
import ForumVoteBreakdown from "./forum-vote-breakdown";
import ManageForumReplyRow from "./manage-forum-reply-row";
import SuspendForumPostDialog from "./suspend-forum-post-dialog";

interface ManageForumAnswerCardProps extends ForumAnswerModerationHandlers {
  answer: AnswerResponse;
  questionAuthorId: string;
  isBestAnswer?: boolean;
  index?: number;
  removedIds: Set<string>;
}

export default function ManageForumAnswerCard({
  answer,
  questionAuthorId,
  isBestAnswer = false,
  index = 0,
  removedIds,
  onDelete,
  onSuspend,
  onUnsuspend,
  isDeleting,
}: ManageForumAnswerCardProps) {
  const replies = (answer.repliedAnswers ?? []).filter(
    (reply) => !removedIds.has(reply.id),
  );
  const [showReplies, setShowReplies] = useState(false);
  const isSuspended = answer.status === "SUSPENDED";

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: Math.min(index, 6) * 0.04 }}
      className={cn(
        "overflow-hidden rounded-2xl border bg-white transition-colors dark:bg-slate-900",
        isSuspended
          ? "border-orange-200 dark:border-orange-500/30"
          : isBestAnswer
            ? "border-amber-300 ring-1 ring-amber-200/60 dark:border-amber-500/40 dark:ring-amber-500/10"
            : "border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700",
      )}
    >
      {isBestAnswer && (
        <div className="flex items-center gap-1.5 bg-amber-50 px-5 py-1.5 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
          <Award size={13} />
          Best answer
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <ForumAuthorLine
              author={answer.author}
              createdAt={answer.createdAt}
              isQuestionAuthor={answer.author.id === questionAuthorId}
            />
            {isSuspended && <SuspendedBadge />}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <SuspendForumPostDialog
              postId={answer.id}
              postLabel={answer.author.name}
              noun="answer"
              suspended={isSuspended}
              onSuspend={(id, reason) => onSuspend(id, reason, false)}
              onUnsuspend={(id) => onUnsuspend(id, false)}
              disabled={isDeleting}
            />
            <DeleteForumAnswerDialog
              answerId={answer.id}
              authorName={answer.author.name}
              replyCount={answer.replyCount}
              onConfirm={onDelete}
              disabled={isDeleting}
            />
          </div>
        </div>

        {isSuspended && <SuspendedNotice reason={answer.suspensionReason} />}

        <p className="mt-3 text-sm leading-6.5 whitespace-pre-line text-slate-600 dark:text-slate-300">
          {answer.body}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
          <ForumVoteBreakdown
            upvoteCount={answer.upvoteCount}
            downvoteCount={answer.downvoteCount}
            score={answer.score}
          />

          {replies.length > 0 ? (
            <button
              type="button"
              onClick={() => setShowReplies((prev) => !prev)}
              aria-expanded={showReplies}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-500/10"
            >
              <MessageCircle size={13} />
              {replies.length} {replies.length === 1 ? "reply" : "replies"}
              <ChevronDown
                size={13}
                className={cn(
                  "transition-transform",
                  showReplies && "rotate-180",
                )}
              />
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 text-xs font-medium text-slate-400 dark:text-slate-500">
              <MessageCircle size={13} />
              No replies
            </span>
          )}
        </div>

        <AnimatePresence initial={false}>
          {showReplies && replies.length > 0 && (
            <motion.div
              key="replies"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-3">
                {replies.map((reply) => (
                  <ManageForumReplyRow
                    key={reply.id}
                    reply={reply}
                    questionAuthorId={questionAuthorId}
                    onDelete={onDelete}
                    onSuspend={onSuspend}
                    onUnsuspend={onUnsuspend}
                    isDeleting={isDeleting}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}
