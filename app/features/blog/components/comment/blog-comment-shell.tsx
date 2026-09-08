import { useState } from "react";
import ProfileLinkWrapper from "~/components/profile-link-wrapper";
import { formatDate } from "~/lib/time";
import { cn } from "~/lib/utils";
import type { RepliedBlogCommentResponse } from "~/types/api-client";
import type { BlogCommentViewer } from "../../types";
import BlogCommentActionsMenu from "./blog-comment-actions-menu";
import BlogCommentAvatar from "./blog-comment-avatar";
import BlogCommentComposer from "./blog-comment-composer";

interface BlogCommentShellProps {
  comment: RepliedBlogCommentResponse;
  postId: string;
  viewer: BlogCommentViewer | null;
  isReply?: boolean;
  /** Reply trigger and nested replies, rendered under the comment body. */
  footer?: React.ReactNode;
}

export default function BlogCommentShell({
  comment,
  postId,
  viewer,
  isReply = false,
  footer,
}: BlogCommentShellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const isOwner = Boolean(viewer) && viewer?.id === comment.author.id;
  const isSuspended = comment.status === "SUSPENDED";
  const label = isReply ? "reply" : "comment";

  return (
    <article className="flex items-start gap-4">
      <BlogCommentAvatar
        name={comment.author.name}
        avatarKey={comment.author.avatarKey}
        className={isReply ? "size-9" : undefined}
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <ProfileLinkWrapper
              authorId={comment.author.id}
              isAuthor={isOwner}
              className="text-[15px] font-bold text-slate-900 dark:text-slate-100"
            >
              {comment.author.name}
            </ProfileLinkWrapper>
            <span className="text-[13px] text-slate-400">
              {formatDate(comment.createdAt)}
            </span>
          </div>

          {isOwner && !isSuspended ? (
            <BlogCommentActionsMenu
              commentId={comment.id}
              label={label}
              onEdit={() => setIsEditing(true)}
            />
          ) : null}
        </div>

        {isEditing ? (
          <BlogCommentComposer
            postId={postId}
            viewer={viewer}
            commentId={comment.id}
            defaultValue={comment.body}
            submitLabel="Save"
            withAvatar={false}
            autoFocus
            className="mt-3"
            onCancel={() => setIsEditing(false)}
            onSuccess={() => setIsEditing(false)}
          />
        ) : (
          <p
            className={cn(
              "mt-1 text-[15px] leading-6 whitespace-pre-line text-slate-700 dark:text-slate-300",
              isSuspended && "text-slate-400 italic dark:text-slate-500",
            )}
          >
            {isSuspended
              ? (comment.suspensionReason ??
                `This ${label} was removed by a moderator.`)
              : comment.body}
          </p>
        )}

        {!isEditing && footer ? footer : null}
      </div>
    </article>
  );
}
