import CommentFormDialog from "~/components/comment-form-dialog";
import type { AnswerResponse } from "~/types/api-client";

interface AddAnswerDialogProps {
  questionId?: string;
  isEditing?: boolean;
  isAuthenticated?: boolean;
  data?: Pick<AnswerResponse, "id" | "body"> | null;
  trigger?: React.ReactNode;
  replyToAnswer?: string;
  onReplySuccess?: (repliedAnswerId: string) => void;
}

export default function AddAnswerDialog({
  questionId,
  isEditing,
  isAuthenticated = false,
  data,
  trigger,
  replyToAnswer,
  onReplySuccess,
}: AddAnswerDialogProps) {
  return (
    <CommentFormDialog
      entityLabel="answer"
      isEditing={isEditing}
      isAuthenticated={isAuthenticated}
      trigger={trigger}
      defaultValue={data?.body ?? ""}
      formKey={isEditing ? `edit-answer-${data?.id ?? "new"}` : "create-answer"}
      fields={{
        actionType: isEditing ? "update-answer" : "create-answer",
        replyToAnswer,
        questionId,
        ...(isEditing ? { answerId: data?.id ?? "" } : {}),
      }}
      // On a successful reply, hand the replied-to answer id back so the parent
      // can auto-open its replies accordion.
      onSuccess={() => {
        if (replyToAnswer) onReplySuccess?.(replyToAnswer);
      }}
    />
  );
}
