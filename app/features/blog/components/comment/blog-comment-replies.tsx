import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import CommentWrapper from "~/components/comment-wrapper";
import type { RepliedBlogCommentResponse } from "~/types/api-client";
import type { BlogCommentViewer } from "../../types";
import BlogCommentShell from "./blog-comment-shell";

interface BlogCommentRepliesProps {
  replies: RepliedBlogCommentResponse[];
  postId: string;
  viewer: BlogCommentViewer | null;
}

export default function BlogCommentReplies({
  replies,
  postId,
  viewer,
}: BlogCommentRepliesProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (replies.length === 0) return null;

  return (
    <div className="mt-1">
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="replies"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {replies.map((reply, index) => (
              <CommentWrapper
                key={reply.id}
                variant="compact"
                isReply
                isFirst={index === 0 && index !== replies.length - 1}
                isLast={index === replies.length - 1}
              >
                <BlogCommentShell
                  comment={reply}
                  postId={postId}
                  viewer={viewer}
                  isReply
                />
              </CommentWrapper>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="mt-3 inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-semibold text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
      >
        {isOpen
          ? "Hide replies"
          : `${replies.length} ${replies.length === 1 ? "reply" : "replies"}`}
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
