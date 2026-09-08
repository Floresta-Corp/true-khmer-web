import ProfileLinkWrapper from "~/components/profile-link-wrapper";
import { formatMinutesOrHoursAgo } from "~/lib/time";
import type { RepliedBlogCommentResponse } from "~/types/api-client";
import BlogCommentAvatar from "./blog-comment-avatar";

interface BlogCommentAuthorProps {
  comment: RepliedBlogCommentResponse;
  isOwner: boolean;
  isReply?: boolean;
}

export default function BlogCommentAuthor({
  comment,
  isOwner,
  isReply = false,
}: BlogCommentAuthorProps) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <BlogCommentAvatar
        name={comment.author.name}
        avatarKey={comment.author.avatarKey}
        className={isReply ? "h-8 w-8" : undefined}
      />
      <div className="flex flex-col">
        <ProfileLinkWrapper
          authorId={comment.author.id}
          isAuthor={isOwner}
          className="truncate text-base leading-6 font-semibold text-[#2c2f31]"
        >
          {comment.author.name}
        </ProfileLinkWrapper>
        <span className="mt-0.5 text-xs leading-4 text-[#595c5e]">
          {formatMinutesOrHoursAgo(comment.createdAt)}
        </span>
      </div>
    </div>
  );
}
