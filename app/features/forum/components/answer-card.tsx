import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import ForumReportDialog, {
  ReportDialogType,
} from "./dialog/forum-report-dialog";
import AnswerVoteComponent from "./answer-vote-component";
import type { Answer } from "~/services/forum/forum-types";
import { formatMinutesOrHoursAgo } from "~/lib/time";
import AddAnswerDialog from "./dialog/add-answer-dialog";
import DeleteAnswerDialog from "./dialog/delete-answer-dialog";
import { Button } from "~/components/ui/button";
import { resolveImageURL } from "~/lib/utils";
import { Separator } from "~/components/ui/separator";
import { useLoaderData } from "react-router";
import type { loader } from "../routes/forum.$id";

interface AnswerCardProps {
  answer: Answer;
  index?: number;
  isCurrentAuthor?: boolean;
  isAuthenticated?: boolean;
}

export default function AnswerCard({
  answer,
  index = 0,
  isCurrentAuthor,
  isAuthenticated = false,
}: AnswerCardProps) {
  const { reportReasons } = useLoaderData<typeof loader>();
  const formattedDate = formatMinutesOrHoursAgo(answer.createdAt);
  const imageUrl = resolveImageURL(answer.author.avatarKey);

  return (
    <motion.article
      className="flex flex-col items-start rounded-2xl border border-[#f3f4f6] bg-white p-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.07,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <div className="flex w-full gap-5 items-start">
        {/* Vote rail */}
        <AnswerVoteComponent
          answerId={answer.id}
          score={answer.score}
          viewerVote={answer.viewerVote}
        />

        {/* Content */}
        <div className="flex flex-1 flex-col gap-5">
          {/* Answer body */}
          <p className="grow text-xs leading-normal text-[#65758b]">
            {answer.body}
          </p>

          <Separator />

          {/* Footer: author + timestamp */}
          <div className="flex items-center justify-between">
            {/* Author */}
            <div className="flex items-center gap-[10.5px]">
              <div className="shrink-0 size-7 rounded-full border border-[#f3f4f6] overflow-hidden">
                <img
                  src={imageUrl}
                  alt={answer.author.name ?? "Author avatar"}
                  className="size-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-[3.5px]">
                <p className="text-xs font-semibold leading-3 text-[#030213] whitespace-nowrap">
                  {answer.author.name}
                </p>
                {/* {answer.author.role && (
                  <p className="text-[10px] font-medium leading-3.75 text-[#99a1af] whitespace-nowrap">
                    {answer.author.role}
                  </p>
                )} */}
              </div>
            </div>

            {/* Timestamp + flag */}
            <div className="flex items-center gap-[10.5px] shrink-0">
              <span className="text-xs font-medium text-[#99a1af] whitespace-nowrap">
                {formattedDate}
              </span>
              {isCurrentAuthor ? (
                <div className="flex items-center justify-end">
                  <div className="flex h-[26.25px] w-[59.5px] items-center gap-1.75">
                    <AddAnswerDialog
                      questionId={answer.questionId}
                      isEditing
                      data={{ id: answer.id, body: answer.body }}
                      trigger={
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-[26.25px] w-[26.25px] rounded-xl bg-[#f9fafb] text-[#99a1af] hover:bg-[#f1f5f9] hover:text-[#344256]"
                        >
                          <Pencil size={12.25} />
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
                          className="h-[26.25px] min-w-[26.25px] flex-1 rounded-xl bg-[#f9fafb] text-[#99a1af] hover:bg-[#f1f5f9] hover:text-[#344256]"
                        >
                          <Trash2 size={12.25} />
                        </Button>
                      }
                    />
                  </div>
                </div>
              ) : (
                <ForumReportDialog
                  title={answer.body}
                  id={answer.id}
                  type={ReportDialogType.ANSWER}
                  reportReasons={
                    reportReasons?.reportingTypes.map((v) => ({
                      id: v.id,
                      reason: v.type,
                    })) || []
                  }
                  isAuthenticated={isAuthenticated}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
