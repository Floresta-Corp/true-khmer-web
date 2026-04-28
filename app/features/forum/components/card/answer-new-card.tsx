import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Pencil, Trash2 } from "lucide-react";
import AnswerVoteComponent from "../answer-vote-component";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import { resolveImageURL } from "~/lib/utils";
import type { Answer } from "~/services/forum/forum-types";
import { formatMinutesOrHoursAgo } from "~/lib/time";
import AddAnswerDialog from "../dialog/add-answer-dialog";
import DeleteAnswerDialog from "../dialog/delete-answer-dialog";
import ForumReportDialog, {
  ReportDialogType,
} from "../dialog/forum-report-dialog";
import { useLoaderData } from "react-router";
import type { loader } from "../../routes/forum.$id";
import NestedReplyCard from "./nested-reply-card";
import CommentWrapper from "../comment-wrapper";

interface AnswerNewCardProps {
  answer: Answer;
  index?: number;
  isCurrentAuthor?: boolean;
  isAuthenticated?: boolean;
}

export default function AnswerNewCard({
  answer,
  index = 0,
  isCurrentAuthor,
  isAuthenticated = false,
}: AnswerNewCardProps) {
  const { reportReasons, userId } = useLoaderData<typeof loader>();
  const formattedDate = formatMinutesOrHoursAgo(answer.createdAt);
  const imageUrl = resolveImageURL(answer.author.avatarKey);
  const replyCount = answer.replyCount;

  return (
    <>
      <motion.article
        className="flex flex-col gap-4 border rounded-xl bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] z-10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.32,
          delay: index * 0.06,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        <div className="flex w-full items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#dfe3e6]">
              <img
                src={imageUrl}
                alt={answer.author.name ?? "Author avatar"}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-base font-semibold leading-6 text-[#2c2f31]">
                {answer.author.name}
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
                  questionId={answer.questionId}
                  isEditing
                  data={{ id: answer.id, body: answer.body }}
                  trigger={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-xl bg-[#f9fafb] text-[#99a1af] hover:bg-[#f1f5f9] hover:text-[#344256]"
                      aria-label="Edit answer"
                    >
                      <Pencil size={12} />
                    </Button>
                  }
                />
                <DeleteAnswerDialog
                  answerId={answer.id}
                  trigger={
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-7 w-7 rounded-xl bg-[#f9fafb] text-[#99a1af] hover:bg-[#f1f5f9] hover:text-[#344256]"
                      aria-label="Delete answer"
                    >
                      <Trash2 size={12} />
                    </Button>
                  }
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className="pb-2">
          <p className="text-base leading-6.5 text-[#595c5e] whitespace-pre-line">
            {answer.body}
          </p>
        </div>

        <Separator className="bg-[#abadaf1a]" />

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-4">
            <div className="rounded-xl border border-[#f3f4f6] bg-[#f9fafb] p-px">
              <AnswerVoteComponent
                answerId={answer.id}
                score={answer.score}
                viewerVote={answer.viewerVote}
                className="w-auto flex-row items-center gap-0 pt-0"
              />
            </div>

            <div className="inline-flex items-center gap-2 text-[#48566a]">
              <MessageCircle className="h-4.5 w-4.5" />
              <span className="text-sm leading-5.25 font-medium">
                {replyCount}
              </span>
            </div>

            <AddAnswerDialog
              questionId={answer.questionId}
              replyToAnswer={answer.id}
              isAuthenticated={isAuthenticated}
              trigger={
                <Button
                  type="button"
                  variant="ghost"
                  className="h-auto p-0 text-sm font-semibold leading-5 text-[#0050d4] hover:bg-transparent hover:text-[#0045b8]"
                >
                  Reply
                </Button>
              }
            />
          </div>

          {!isCurrentAuthor ? (
            <ForumReportDialog
              title={answer.body}
              id={answer.id}
              type={ReportDialogType.ANSWER}
              reportReasons={reportReasons.reportingTypes.map((v) => ({
                id: v.id,
                reason: v.type,
              }))}
              isAuthenticated={isAuthenticated}
            />
          ) : null}
        </div>
      </motion.article>

      {answer.repliedAnswers && (
        <CommentWrapper>
          <AnimatePresence mode="wait">
            {answer.repliedAnswers.map((repliedAnswer, repliedIndex) => (
              <motion.div
                key={repliedAnswer.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0, y: -6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <CommentWrapper
                  isReply
                  isFirst={
                    repliedIndex === 0 &&
                    repliedIndex !== answer.repliedAnswers!.length - 1
                  }
                  isLast={repliedIndex === answer.repliedAnswers!.length - 1}
                >
                  <NestedReplyCard
                    repliedAnswer={repliedAnswer}
                    questionId={answer.questionId}
                    isCurrentAuthor={repliedAnswer.author.id === userId}
                  />
                </CommentWrapper>
              </motion.div>
            ))}
          </AnimatePresence>
        </CommentWrapper>
      )}
    </>
  );
}
