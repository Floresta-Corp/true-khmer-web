import {
  Reply,
  Clock,
  ThumbsUp,
  Edit2,
  Trash2,
  ThumbsDown,
  Meh,
} from "lucide-react";
import ThreadsTitle from "./threads-title";
import { Card, CardContent } from "~/components/ui/card";
import { useLoaderData, Link } from "react-router";
import type { loader } from "../../routes/forum";
import { Button } from "~/components/ui/button";
import { formatMinutesOrHoursAgo } from "~/lib/time";
import type { Answer } from "~/services/forum/types";
import DeleteAnswerDialog from "../dialog/delete-answer-dialog";
import AddAnswerDialog from "../dialog/add-answer-dialog";
import AnswerCardSkeleton from "../card/answer-card-skeleton";

interface MyActivityAnswerListProps {
  isLoading?: boolean;
}

function AnswerScoreIcon({ score }: { score: number }) {
  if (score === 0) {
    return <Meh size={11} className="text-gray-500" />;
  } else if (score > 0) {
    return <ThumbsUp size={11} className="text-green-500" />;
  } else if (score < 0) {
    return <ThumbsDown size={11} className="text-red-500" />;
  }
}

function CheckHelpFul(score: number) {
  if (score === 0) return `Ok`;
  if (score > 0) return `Helpful`;
  if (score < 0) return `Not helpful`;
}

export default function MyActivityAnswerList({
  isLoading,
}: MyActivityAnswerListProps) {
  const { answers } = useLoaderData<typeof loader>();

  if (isLoading && (!answers || answers.length === 0)) {
    return (
      <div className="bb-3.75">
        <ThreadsTitle
          icon={<Reply className="size-2.5" />}
          title="My answers"
        />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <AnswerCardSkeleton key={`answer-card-skeleton-${index}`} />
          ))}
        </div>
      </div>
    );
  }

  if (!answers || answers.length === 0) {
    return (
      <div className="pb-3.75">
        <ThreadsTitle
          icon={<Reply className="size-2.5" />}
          title="My answers"
        />
        <div className="text-center py-12 text-[#9eacc0]">No answers found</div>
      </div>
    );
  }

  return (
    <div className="pb-3.75">
      <ThreadsTitle icon={<Reply className="size-2.5" />} title="My answers" />
      <div className="flex flex-col gap-4">
        {answers.map((answer: Answer) => (
          <Card
            key={answer.id}
            className="w-134 rounded-3xl border-[#f3f4f6] p-6 shadow-none"
          >
            <CardContent className="p-0 space-y-4">
              {/* Header with Answer label and timestamp */}
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold text-[#2f6fe4]">Answer</p>
                <div className="flex items-center gap-1.5 text-[#9eacc0]">
                  <Clock size={16} className="shrink-0" />
                  <span className="text-xs font-medium">
                    {formatMinutesOrHoursAgo(answer.createdAt)}
                  </span>
                </div>
              </div>

              {/* Answer body */}
              <p className="text-xs text-[#65758b] line-clamp-3 leading-relaxed">
                {answer.body}
              </p>

              {/* Footer with helpful count and action buttons */}
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-6">
                  {/* Helpful count */}
                  {(answer.score || answer.score !== 0) && (
                    <div className="flex items-center gap-1.5 text-[#9eacc0]">
                      <AnswerScoreIcon score={answer.score} />
                      <div className="text-xs flex font-semibold gap-1.5">
                        <p>{answer.score}</p>
                        <p>{CheckHelpFul(answer.score)}</p>
                      </div>
                    </div>
                  )}
                  {/* View discussion thread link */}
                  <Link
                    to={`/forum/${answer.questionId}`}
                    className="text-xs font-semibold text-[#2f6fe4] hover:underline"
                  >
                    View discussion thread
                  </Link>
                </div>

                {/* Edit and Delete buttons */}
                <div className="flex items-center gap-2">
                  <AddAnswerDialog
                    questionId={answer.questionId}
                    isAuthenticated
                    isEditing
                    data={answer}
                    trigger={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-[26.25px] w-[26.25px] rounded-xl bg-[#f9fafb] text-[#99a1af] hover:bg-[#f1f5f9] hover:text-[#344256]"
                      >
                        <Edit2 size={12.25} />
                      </Button>
                    }
                  />
                  <DeleteAnswerDialog
                    answerId={answer.id}
                    trigger={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-[26.25px] w-[26.25px] rounded-xl bg-[#f9fafb] text-[#99a1af] hover:bg-[#f1f5f9] hover:text-[#344256]"
                      >
                        <Trash2 size={12.25} />
                      </Button>
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
