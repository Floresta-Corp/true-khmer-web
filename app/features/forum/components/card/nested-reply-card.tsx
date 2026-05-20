import { Pencil, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import AnswerVoteComponent from "../answer-vote-component";
import { Button } from "~/components/ui/button";
import { resolveImageURL, cn } from "~/lib/utils";
import type { Answer } from "~/services/forum/forum-types";
import { formatMinutesOrHoursAgo } from "~/lib/time";
import AddAnswerDialog from "../dialog/add-answer-dialog";
import DeleteAnswerDialog from "../dialog/delete-answer-dialog";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import SlideToLeftHoverAnimation from "~/components/slide-to-left-hover-animation";
import ForumReportDialog, {
  ReportDialogType,
  type ReportReasonData,
} from "../dialog/forum-report-dialog";
import { highlightAnswerClassName } from "../../utils";

type RepliedAnswer = NonNullable<Answer["repliedAnswers"]>[number];

interface NestedReplyCardProps {
  repliedAnswer: RepliedAnswer;
  questionId?: string;
  isCurrentAuthor?: boolean;
  isAuthenticated?: boolean;
  reportReasons: ReportReasonData[];
}

export default function NestedReplyCard({
  repliedAnswer,
  questionId,
  isAuthenticated = false,
  isCurrentAuthor,
  reportReasons,
}: NestedReplyCardProps) {
  const formattedDate = formatMinutesOrHoursAgo(repliedAnswer.createdAt);
  const imageUrl = resolveImageURL(repliedAnswer.author.avatarKey);
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const cardRef = useRef<HTMLElement>(null);
  const id = decodeURIComponent(location.hash.replace(/^#answer-/, ""));
  const isHighlighted = id === repliedAnswer.id;
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isHighlighted && cardRef.current) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
      setShowAnimation(true);
      const timer = setTimeout(() => setShowAnimation(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isHighlighted]);

  return (
    <motion.article
      ref={cardRef}
      id={`answer-${repliedAnswer.id}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "w-full rounded-xl bg-[#fffefe] border border-slate-200 px-5 py-5 shadow-[0px_1px_2px_rgba(15,23,42,0.04)]",
        showAnimation && highlightAnswerClassName,
      )}
    >
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
            <SlideToLeftHoverAnimation isHovered={isHovered}>
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
            </SlideToLeftHoverAnimation>
          ) : null}
        </div>
      </div>

      <p className="mt-4 text-sm leading-[22.75px] text-[#595c5e] whitespace-pre-line">
        {repliedAnswer.body}
      </p>

      <div className="mt-4 flex items-center justify-between pt-[1.2px]">
        <AnswerVoteComponent
          answerId={repliedAnswer.id}
          score={repliedAnswer.score}
          viewerVote={repliedAnswer.viewerVote}
          className="w-auto flex-row items-center gap-0 pt-0"
        />

        {!isCurrentAuthor && (
          <ForumReportDialog
            title={repliedAnswer.body}
            id={repliedAnswer.id}
            type={ReportDialogType.ANSWER}
            reportReasons={reportReasons}
            isAuthenticated={isAuthenticated}
          />
        )}
      </div>
    </motion.article>
  );
}
