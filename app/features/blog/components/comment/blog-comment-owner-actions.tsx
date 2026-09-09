import { Pencil, Trash2 } from "lucide-react";
import CommentFormDialog from "~/components/comment-form-dialog";
import SlideToLeftHoverAnimation from "~/components/slide-to-left-hover-animation";
import { Button } from "~/components/ui/button";
import type { RepliedBlogCommentResponse } from "~/types/api-client";
import { BLOG_COMMENT_ACTIONS } from "../../types";
import DeleteBlogCommentDialog from "./delete-blog-comment-dialog";

const ICON_BUTTON_CLASS =
  "h-7 w-7 rounded-xl bg-[#f9fafb] text-[#99a1af] hover:bg-[#f1f5f9] hover:text-[#344256]";

interface BlogCommentOwnerActionsProps {
  comment: RepliedBlogCommentResponse;
  label: string;
  isHovered: boolean;
}

export default function BlogCommentOwnerActions({
  comment,
  label,
  isHovered,
}: BlogCommentOwnerActionsProps) {
  return (
    <SlideToLeftHoverAnimation isHovered={isHovered}>
      <CommentFormDialog
        entityLabel={label}
        isEditing
        method="post"
        defaultValue={comment.body}
        formKey={`edit-comment-${comment.id}`}
        fields={{
          actionType: BLOG_COMMENT_ACTIONS.update,
          commentId: comment.id,
        }}
        trigger={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={ICON_BUTTON_CLASS}
            aria-label={`Edit ${label}`}
          >
            <Pencil size={12} />
          </Button>
        }
      />
      <DeleteBlogCommentDialog
        commentId={comment.id}
        label={label}
        trigger={
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className={ICON_BUTTON_CLASS}
            aria-label={`Delete ${label}`}
          >
            <Trash2 size={12} />
          </Button>
        }
      />
    </SlideToLeftHoverAnimation>
  );
}
