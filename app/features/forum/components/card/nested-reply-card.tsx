import { CircleAlert } from "lucide-react";
import AnswerVoteComponent from "../answer-vote-component";
import { Button } from "~/components/ui/button";
import { resolveImageURL } from "~/lib/utils";
import type { Answer } from "~/services/forum/forum-types";
import { formatMinutesOrHoursAgo } from "~/lib/time";

type RepliedAnswer = NonNullable<Answer["repliedAnswers"]>[number];

interface NestedReplyCardProps {
  repliedAnswer: RepliedAnswer;
}

export default function NestedReplyCard({
  repliedAnswer,
}: NestedReplyCardProps) {
  const formattedDate = formatMinutesOrHoursAgo(repliedAnswer.createdAt);
  const imageUrl = resolveImageURL(repliedAnswer.author.avatarKey);

  return (
    <div className="mt-4 flex items-start gap-6">
      <div className="mt-4 h-px w-6 shrink-0 bg-[#abadaf4d]" />

      <article className="w-full rounded-xl border-l-2 border-[#abadaf4d] bg-[#eef1f380] px-6 py-6">
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
    </div>
  );
}
