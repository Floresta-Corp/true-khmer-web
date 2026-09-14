import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useLocation } from "react-router";
import { cn } from "~/lib/utils";
import type { RepliedBlogCommentResponse } from "~/types/api-client";
import type { BlogCommentViewer } from "../../types";
import BlogCommentAuthor from "./blog-comment-author";
import BlogCommentBody from "./blog-comment-body";
import BlogCommentOwnerActions from "./blog-comment-owner-actions";
import {
  getBlogCommentIdFromHash,
  highlightBlogCommentClassName,
} from "./blog-comment-highlight";

interface BlogCommentReplyCardProps {
  reply: RepliedBlogCommentResponse;
  viewer: BlogCommentViewer | null;
}

export default function BlogCommentReplyCard({
  reply,
  viewer,
}: BlogCommentReplyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const cardRef = useRef<HTMLElement>(null);
  const isHighlighted = getBlogCommentIdFromHash(location.hash) === reply.id;
  const [showAnimation, setShowAnimation] = useState(false);
  const isOwner = Boolean(viewer) && viewer?.id === reply.author.id;

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
    <motion.article
      ref={cardRef}
      id={reply.id}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "w-full rounded-xl border border-slate-200 bg-[#fffefe] px-5 py-5 shadow-[0px_1px_2px_rgba(15,23,42,0.04)]",
        showAnimation && highlightBlogCommentClassName,
      )}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <BlogCommentAuthor comment={reply} isOwner={isOwner} isReply />

        {isOwner && reply.status !== "SUSPENDED" ? (
          <BlogCommentOwnerActions
            comment={reply}
            label="reply"
            isHovered={isHovered}
          />
        ) : null}
      </div>

      <BlogCommentBody
        comment={reply}
        label="reply"
        className="mt-4 text-sm leading-[22.75px]"
      />
    </motion.article>
  );
}
