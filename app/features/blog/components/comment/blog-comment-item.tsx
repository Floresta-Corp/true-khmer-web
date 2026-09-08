import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "~/components/ui/button";
import type { BlogCommentResponse } from "~/types/api-client";
import type { BlogCommentViewer } from "../../types";
import BlogCommentComposer from "./blog-comment-composer";
import BlogCommentReplies from "./blog-comment-replies";
import BlogCommentShell from "./blog-comment-shell";

interface BlogCommentItemProps {
  comment: BlogCommentResponse;
  postId: string;
  viewer: BlogCommentViewer | null;
  index?: number;
}

export default function BlogCommentItem({
  comment,
  postId,
  viewer,
  index = 0,
}: BlogCommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.05, ease: "easeOut" }}
    >
      <BlogCommentShell
        comment={comment}
        postId={postId}
        viewer={viewer}
        footer={
          <>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsReplying((replying) => !replying)}
              className="mt-1 h-auto cursor-pointer p-0 text-[13px] font-semibold text-slate-400 hover:bg-transparent hover:text-slate-600 dark:hover:text-slate-200"
            >
              Reply
            </Button>

            {isReplying ? (
              <BlogCommentComposer
                postId={postId}
                viewer={viewer}
                replyToComment={comment.id}
                placeholder="Write a reply..."
                submitLabel="Reply"
                withAvatar={false}
                autoFocus
                className="mt-3"
                onCancel={() => setIsReplying(false)}
                onSuccess={() => setIsReplying(false)}
              />
            ) : null}

            <BlogCommentReplies
              replies={comment.repliedComments ?? []}
              postId={postId}
              viewer={viewer}
            />
          </>
        }
      />
    </motion.div>
  );
}
