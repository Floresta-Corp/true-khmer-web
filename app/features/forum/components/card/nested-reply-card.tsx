import { CircleAlert, Pencil, Trash2 } from "lucide-react";
import AnswerVoteComponent from "../answer-vote-component";
import { Button } from "~/components/ui/button";
import { resolveImageURL } from "~/lib/utils";
import type { Answer } from "~/services/forum/forum-types";
import { formatMinutesOrHoursAgo } from "~/lib/time";
import AddAnswerDialog from "../dialog/add-answer-dialog";
import DeleteAnswerDialog from "../dialog/delete-answer-dialog";

type RepliedAnswer = NonNullable<Answer["repliedAnswers"]>[number];

interface NestedReplyCardProps {
  repliedAnswer: RepliedAnswer;
  questionId?: string;
  isCurrentAuthor?: boolean;
}

export default function NestedReplyCard({
  repliedAnswer,
  questionId,
  isCurrentAuthor = false,
}: NestedReplyCardProps) {
  const formattedDate = formatMinutesOrHoursAgo(repliedAnswer.createdAt);
  const imageUrl = resolveImageURL(repliedAnswer.author.avatarKey);

  return (
    <article className="w-full rounded-xl bg-[#fffefe] border border-slate-200 px-5 py-5 shadow-[0px_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex w-full items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-[#dfe3e6]">
            <img
              src={imageUrl}
              alt={repliedAnswer.author.name ?? "Author avatar"}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <p className="text-base font-semibold leading-6 text-[#2c2f31]">
              {repliedAnswer.author.name}
            </p>
            <span className="text-xs leading-4 text-[#595c5e]">
              {formattedDate}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isCurrentAuthor ? (
            <div className="flex items-center gap-1.5">
              <AddAnswerDialog
                questionId={questionId}
                isEditing
                data={{ id: repliedAnswer.id, body: repliedAnswer.body }}
                trigger={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-xl bg-[#f9fafb] text-[#99a1af] hover:bg-[#f1f5f9] hover:text-[#344256]"
                    aria-label="Edit reply"
                  >
                    <Pencil size={12} />
                  </Button>
                }
              />
              <DeleteAnswerDialog
                answerId={repliedAnswer.id}
                trigger={
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-7 w-7 rounded-xl bg-[#f9fafb] text-[#99a1af] hover:bg-[#f1f5f9] hover:text-[#344256]"
                    aria-label="Delete reply"
                  >
                    <Trash2 size={12} />
                  </Button>
                }
              />
            </div>
          ) : null}
        </div>
      </div>

      <p className="mt-4 text-sm leading-[22.75px] text-[#595c5e]">
        {repliedAnswer.body}
      </p>

      <div className="mt-4 flex items-center justify-between pt-[1.2px]">
        <div className="rounded-xl border border-[#f3f4f6] bg-[#f9fafb] p-px">
          <AnswerVoteComponent
            answerId={repliedAnswer.id}
            score={repliedAnswer.score}
            viewerVote={repliedAnswer.viewerVote}
            className="w-auto flex-row items-center gap-0 pt-0"
          />
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-5 w-5 rounded-sm p-0 text-[#99a1af] hover:bg-transparent hover:text-[#4a5565]"
          aria-label="Reply information"
        >
          <CircleAlert className="h-3.5 w-3.5" />
        </Button>
      </div>
    </article>
  );
}
