import { AnimatePresence, motion } from "motion/react";
import { Award, MessageCircle, Pencil, Trash2 } from "lucide-react";
import AnswerVoteComponent from "../answer-vote-component";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import { resolveImageURL, cn } from "~/lib/utils";
import type { Answer } from "~/services/forum/forum-types";
import { formatMinutesOrHoursAgo } from "~/lib/time";
import AddAnswerDialog from "../dialog/add-answer-dialog";
import DeleteAnswerDialog from "../dialog/delete-answer-dialog";
import ForumReportDialog, {
  ReportDialogType,
  type ReportReasonData,
} from "../dialog/forum-report-dialog";
import NestedReplyCard from "./nested-reply-card";
import CommentWrapper from "../comment-wrapper";
import SlideToLeftHoverAnimation from "~/components/slide-to-left-hover-animation";
import MarkBestAnswerDialog from "../dialog/mark-best-answer-dialog";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { highlightAnswerClassName } from "../../utils";

interface AnswerNewCardProps {
  answer: Answer;
  index?: number;
  isCurrentAuthor?: boolean;
  isAuthenticated?: boolean;
  isQuestionAuthor?: boolean;
  isBestAnswer?: boolean;
  reportReasons?: ReportReasonData[];
  userId: string | null;
}

function AnswerComponent({
  answer,
  userId,
  index = 0,
  isAuthenticated = false,
  isBestAnswer = false,
  isCurrentAuthor = false,
  isQuestionAuthor = false,
  reportReasons,
}: AnswerNewCardProps) {
  const formattedDate = formatMinutesOrHoursAgo(answer.createdAt);
  const imageUrl = resolveImageURL(answer.author.avatarKey);
  const replyCount = answer.replyCount;
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const id = decodeURIComponent(location.hash.replace(/^#answer-/, ""));
  const cardRef = useRef<HTMLElement>(null);
  const isHighlighted = id === answer.id;
  const [showAnimation, setShowAnimation] = useState(false);

  const openAccordion =
    answer.repliedAnswers?.some((a) => id === a.id) || id === answer.id
      ? "replies"
      : undefined;

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
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue={openAccordion}
    >
      <AccordionItem value="replies">
        <motion.article
          ref={cardRef}
          id={`answer-${answer.id}`}
          className={cn(
            "z-10 flex flex-col gap-4 rounded-3xl border border-[#f3f4f6] bg-white p-6 shadow-none",
            showAnimation && highlightAnswerClassName,
          )}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.32,
            delay: index * 0.06,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
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
              <SlideToLeftHoverAnimation isHovered={isHovered}>
                {isQuestionAuthor && !isBestAnswer && (
                  <MarkBestAnswerDialog
                    answerId={answer.id}
                    trigger={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-xl bg-[#f9fafb] text-[#99a1af] hover:bg-[#f1f5f9] hover:text-[#344256]"
                        aria-label="Mark best answer"
                      >
                        <Award size={12} />
                      </Button>
                    }
                  />
                )}
                {isCurrentAuthor && (
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
                )}
                {isCurrentAuthor && (
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
                )}
              </SlideToLeftHoverAnimation>
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
              <AnswerVoteComponent
                answerId={answer.id}
                score={answer.score}
                viewerVote={answer.viewerVote}
                className="w-auto flex-row items-center gap-0 pt-0"
              />

              <AddAnswerDialog
                questionId={answer.questionId}
                replyToAnswer={answer.id}
                isAuthenticated={isAuthenticated}
                trigger={
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-auto cursor-pointer p-0 text-sm font-semibold leading-5 text-[#0050d4] hover:bg-transparent hover:text-[#0045b8]"
                  >
                    Reply
                  </Button>
                }
              />

              {replyCount > 0 ? (
                <AccordionTrigger className="inline-flex items-center gap-2 text-[#48566a]">
                  <MessageCircle className="h-4.5 w-4.5" />
                  <span className="text-sm leading-5.25 font-medium">
                    {replyCount} {replyCount === 1 ? "reply" : "replies"}
                  </span>
                </AccordionTrigger>
              ) : (
                <div className="inline-flex items-center gap-2 text-[#48566a]">
                  <MessageCircle className="h-4.5 w-4.5" />
                  <span className="text-sm leading-5.25 font-medium">
                    {replyCount} {replyCount === 1 ? "reply" : "replies"}
                  </span>
                </div>
              )}
            </div>

            {!isCurrentAuthor ? (
              <ForumReportDialog
                title={answer.body}
                id={answer.id}
                type={ReportDialogType.ANSWER}
                reportReasons={reportReasons || []}
                isAuthenticated={isAuthenticated}
              />
            ) : null}
          </div>
        </motion.article>
        {answer.repliedAnswers && (
          <AccordionContent>
            <CommentWrapper>
              <AnimatePresence>
                {answer.repliedAnswers.map((repliedAnswer, repliedIndex) => (
                  <motion.div
                    key={repliedAnswer.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      marginBottom: 0,
                      y: -6,
                    }}
                    id={repliedAnswer.id}
                    transition={{ duration: 0.18, ease: "easeInOut" }}
                  >
                    <CommentWrapper
                      isReply
                      isFirst={
                        repliedIndex === 0 &&
                        repliedIndex !== answer.repliedAnswers!.length - 1
                      }
                      isLast={
                        repliedIndex === answer.repliedAnswers!.length - 1
                      }
                    >
                      <NestedReplyCard
                        reportReasons={reportReasons || []}
                        repliedAnswer={repliedAnswer}
                        questionId={answer.questionId}
                        isCurrentAuthor={userId === repliedAnswer.author.id}
                        isAuthenticated={isAuthenticated}
                      />
                    </CommentWrapper>
                  </motion.div>
                ))}
              </AnimatePresence>
            </CommentWrapper>
          </AccordionContent>
        )}
      </AccordionItem>
    </Accordion>
  );
}

export default function AnswerNewCard({
  answer,
  index = 0,
  isCurrentAuthor,
  isAuthenticated = false,
  isQuestionAuthor,
  reportReasons,
  isBestAnswer = false,
  userId,
}: AnswerNewCardProps) {
  return (
    <AnswerComponent
      answer={answer}
      userId={userId}
      index={index}
      isAuthenticated={isAuthenticated}
      isBestAnswer={isBestAnswer}
      isCurrentAuthor={isCurrentAuthor}
      isQuestionAuthor={isQuestionAuthor}
      reportReasons={reportReasons}
    />
  );
}
