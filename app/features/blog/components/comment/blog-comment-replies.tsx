import { AnimatePresence, motion } from "motion/react";
import CommentWrapper from "~/components/comment-wrapper";
import type { RepliedBlogCommentResponse } from "~/types/api-client";
import type { BlogCommentViewer } from "../../types";
import BlogCommentReplyCard from "./blog-comment-reply-card";

interface BlogCommentRepliesProps {
  replies: RepliedBlogCommentResponse[];
  viewer: BlogCommentViewer | null;
}

export default function BlogCommentReplies({
  replies,
  viewer,
}: BlogCommentRepliesProps) {
  return (
    <CommentWrapper>
      <AnimatePresence>
        {replies.map((reply, index) => (
          <motion.div
            key={reply.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
          >
            <CommentWrapper
              isReply
              isFirst={index === 0 && index !== replies.length - 1}
              isLast={index === replies.length - 1}
            >
              <BlogCommentReplyCard reply={reply} viewer={viewer} />
            </CommentWrapper>
          </motion.div>
        ))}
      </AnimatePresence>
    </CommentWrapper>
  );
}
