import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { useLocation } from "react-router";
import CommentFormDialog from "~/components/comment-form-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import type { BlogCommentResponse } from "~/types/api-client";
import { BLOG_COMMENT_ACTIONS, type BlogCommentViewer } from "../../types";
import BlogCommentAuthor from "./blog-comment-author";
import BlogCommentBody from "./blog-comment-body";
import BlogCommentOwnerActions from "./blog-comment-owner-actions";
import BlogCommentReplies from "./blog-comment-replies";
import {
  getBlogCommentIdFromHash,
  highlightBlogCommentClassName,
} from "./blog-comment-highlight";

interface BlogCommentCardProps {
  comment: BlogCommentResponse;
  postId: string;
  viewer: BlogCommentViewer | null;
  index?: number;
}

export default function BlogCommentCard({
  comment,
  postId,
  viewer,
  index = 0,
}: BlogCommentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const targetCommentId = getBlogCommentIdFromHash(location.hash);
  const replies = comment.repliedComments ?? [];
  const containsTargetReply = replies.some(
    (reply) => reply.id === targetCommentId,
  );
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    containsTargetReply ? "replies" : undefined,
  );
  const cardRef = useRef<HTMLElement>(null);
  const isHighlighted = targetCommentId === comment.id;
  const [showAnimation, setShowAnimation] = useState(false);
  const replyCount = comment.replyCount;
  const isOwner = Boolean(viewer) && viewer?.id === comment.author.id;
  const replyLabel = replyCount === 1 ? "reply" : "replies";

  useEffect(() => {
    if (containsTargetReply) setAccordionValue("replies");
  }, [containsTargetReply]);

  useEffect(() => {
    if (!isHighlighted || !cardRef.current) return;

    const scrollTimer = window.setTimeout(() => {
      cardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
    setShowAnimation(true);
    const animationTimer = window.setTimeout(
      () => setShowAnimation(false),
      1500,
    );

    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(animationTimer);
    };
  }, [isHighlighted]);

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      value={accordionValue}
      onValueChange={setAccordionValue}
    >
      <AccordionItem value="replies">
        <motion.article
          ref={cardRef}
          id={comment.id}
          className={cn(
            "z-10 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-none",
            showAnimation && highlightBlogCommentClassName,
          )}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.32,
            delay: index * 0.06,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <div className="flex w-full items-start justify-between gap-2">
            <BlogCommentAuthor comment={comment} isOwner={isOwner} />

            {isOwner && comment.status !== "SUSPENDED" ? (
              <BlogCommentOwnerActions
                comment={comment}
                label="comment"
                isHovered={isHovered}
              />
            ) : null}
          </div>

          <div className="pb-2">
            <BlogCommentBody
              comment={comment}
              label="comment"
              className="text-base leading-6.5"
            />
          </div>

          <Separator className="bg-[#abadaf1a]" />

          <div className="flex items-center gap-4 pt-1">
            <CommentFormDialog
              entityLabel="reply"
              isAuthenticated={Boolean(viewer)}
              placeholder="Share your thoughts on this comment..."
              fields={{
                actionType: BLOG_COMMENT_ACTIONS.create,
                postId,
                replyToComment: comment.id,
              }}
              onSuccess={() => setAccordionValue("replies")}
              trigger={
                <Button
                  type="button"
                  variant="ghost"
                  className="h-auto cursor-pointer p-0 text-sm leading-5 font-semibold text-[#0050d4] hover:bg-transparent hover:text-[#0045b8]"
                >
                  Reply
                </Button>
              }
            />

            {replyCount > 0 ? (
              <AccordionTrigger className="inline-flex items-center gap-2 text-[#48566a]">
                <MessageCircle className="h-4.5 w-4.5" />
                <span className="text-sm leading-5.25 font-medium">
                  {replyCount} {replyLabel}
                </span>
              </AccordionTrigger>
            ) : (
              <div className="inline-flex items-center gap-2 text-[#48566a]">
                <MessageCircle className="h-4.5 w-4.5" />
                <span className="text-sm leading-5.25 font-medium">
                  {replyCount} {replyLabel}
                </span>
              </div>
            )}
          </div>
        </motion.article>

        {replies.length > 0 ? (
          <AccordionContent>
            <BlogCommentReplies replies={replies} viewer={viewer} />
          </AccordionContent>
        ) : null}
      </AccordionItem>
    </Accordion>
  );
}
