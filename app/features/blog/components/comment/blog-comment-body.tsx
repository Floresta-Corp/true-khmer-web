import { cn } from "~/lib/utils";
import type { RepliedBlogCommentResponse } from "~/types/api-client";

interface BlogCommentBodyProps {
  comment: RepliedBlogCommentResponse;
  label: string;
  className?: string;
}

export default function BlogCommentBody({
  comment,
  label,
  className,
}: BlogCommentBodyProps) {
  const isSuspended = comment.status === "SUSPENDED";

  return (
    <p
      className={cn(
        "whitespace-pre-line text-[#595c5e]",
        isSuspended && "text-[#9eacc0] italic",
        className,
      )}
    >
      {isSuspended
        ? (comment.suspensionReason ??
          `This ${label} was removed by a moderator.`)
        : comment.body}
    </p>
  );
}
