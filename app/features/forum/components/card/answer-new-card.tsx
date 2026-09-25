import { AnimatePresence, motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import AnswerVoteComponent from "../answer-vote-component";
import { Separator } from "~/components/ui/separator";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { getInitials } from "~/routes/onboarding/domain/profile/profile-utils";
import { resolveImageURL, cn } from "~/lib/utils";
import type { AnswerResponse } from "~/types/api-client";
import { formatMinutesOrHoursAgo } from "~/lib/time";
import { type ReportReasonData } from "../dialog/forum-report-dialog";
import NestedReplyCard from "./nested-reply-card";
import CommentWrapper from "~/components/comment-wrapper";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import CommentReplyBox from "~/components/comment-reply-box";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { highlightAnswerClassName } from "../../utils";
import ProfileLinkWrapper from "~/components/profile-link-wrapper";
import AnswerActionsDropdown from "../dropdown/answer-actions-dropdown";

interface AnswerNewCardProps {
  answer: AnswerResponse;
  index?: number;
  isCurrentAuthor?: boolean;
  isAuthenticated?: boolean;
  isBestAnswer?: boolean;
  reportReasons?: ReportReasonData[];
  userId: string | null;
  questionAuthorId?: string | null;
}

function AnswerComponent({
  answer,
  userId,
  index = 0,
  isAuthenticated = false,
  isBestAnswer = false,
  isCurrentAuthor = false,
  reportReasons,
  questionAuthorId,
}: AnswerNewCardProps) {
  const isAnswerByQuestionAuthor =
    Boolean(questionAuthorId) && answer.author.id === questionAuthorId;
  const isViewerQuestionAuthor = Boolean(userId) && userId === questionAuthorId;
  const formattedDate = formatMinutesOrHoursAgo(answer.createdAt);
  const imageUrl = resolveImageURL(answer.author.avatarKey);
  const replyCount = answer.replyCount;
  const location = useLocation();
  let id: string | null = null;
  const match = location.hash.match(/^#answer-([A-Za-z0-9-_]+)$/);
  try {
    id = match ? decodeURIComponent(match[1]) : null;
  } catch {
    id = null;
  }
  const cardRef = useRef<HTMLElement>(null);
  const isHighlighted = id !== null && id === answer.id;
  const [showAnimation, setShowAnimation] = useState(false);

  const openAccordion =
    (id && answer.repliedAnswers?.some((a) => id === a.id)) || id === answer.id
      ? "replies"
      : undefined;

  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    openAccordion,
  );
  const [repliedAnswerId, setRepliedAnswerId] = useState<string | null>(null);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const loginHref = `/login?redirectTo=${encodeURIComponent(
    `${location.pathname}${location.search}`,
  )}`;

  // After a reply succeeds we save the replied-to answer id; once it matches
  // this answer (or one of its replies) we auto-open the replies accordion.
  useEffect(() => {
    if (
      repliedAnswerId &&
      (repliedAnswerId === answer.id ||
        answer.repliedAnswers?.some((a) => a.id === repliedAnswerId))
    ) {
      setAccordionValue("replies");
    }
  }, [repliedAnswerId, answer.id, answer.repliedAnswers]);

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
      value={accordionValue}
      onValueChange={setAccordionValue}
    >
      <AccordionItem value="replies">
        <motion.article
          ref={cardRef}
          id={`answer-${answer.id}`}
          className={cn(
            "z-10 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-none",
            isBestAnswer && "border border-[#0050d4]/30",
            showAnimation && highlightAnswerClassName,
          )}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.32,
            delay: index * 0.06,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          <div className="flex w-full items-start justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Avatar>
                {imageUrl && (
                  <AvatarImage
                    src={imageUrl}
                    alt={answer.author.name ?? "Author avatar"}
                  />
                )}
                <AvatarFallback className="bg-[#dfe3e6] text-sm font-semibold text-[#2c2f31]">
                  {getInitials(answer.author.name ?? "") || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <ProfileLinkWrapper
                    className="truncate text-base leading-6 font-semibold text-[#2c2f31]"
                    authorId={answer.author.id}
                    isAuthor={isCurrentAuthor}
                  >
                    {answer.author.name}
                  </ProfileLinkWrapper>
                  {isAnswerByQuestionAuthor && (
                    <Badge
                      variant="secondary"
                      className="pointer-events-none shrink-0 bg-green-100 text-xs font-semibold text-green-700"
                    >
                      Author
                    </Badge>
                  )}
                </div>
                <span className="mt-0.5 text-xs leading-4 text-[#595c5e]">
                  {formattedDate}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <AnswerActionsDropdown
                answerId={answer.id}
                answerBody={answer.body}
                questionId={answer.questionId}
                isCurrentAuthor={isCurrentAuthor}
                isAuthenticated={isAuthenticated}
                canMarkBestAnswer={isViewerQuestionAuthor && !isBestAnswer}
                reportReasons={reportReasons}
              />
            </div>
          </div>

          <div className="">
            <p className="text-base leading-6.5 whitespace-pre-line text-[#595c5e]">
              {answer.body}
            </p>
          </div>

          <Separator className="bg-[#abadaf1a]" />

          <div className="flex items-center pt-1">
            <div className="flex items-center gap-4">
              <AnswerVoteComponent
                answerId={answer.id}
                score={answer.score}
                viewerVote={answer.viewerVote}
                className="w-auto flex-row items-center gap-0 pt-0"
              />

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => setIsReplyOpen((previous) => !previous)}
                  aria-expanded={isReplyOpen}
                  className="cursor-pointer bg-transparent text-sm leading-5 font-semibold text-[#0050d4] transition-colors outline-none hover:text-[#0045b8] focus-visible:underline focus-visible:underline-offset-4"
                >
                  Reply
                </button>
              ) : (
                <Link
                  to={loginHref}
                  className="text-sm leading-5 font-semibold text-[#0050d4] hover:text-[#0045b8]"
                >
                  Reply
                </Link>
              )}

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
          </div>

          <AnimatePresence initial={false}>
            {isReplyOpen ? (
              <motion.div
                key="reply-box"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.18, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <CommentReplyBox
                  autoFocus
                  className="pt-2"
                  textareaClassName="min-h-20"
                  fields={{
                    actionType: "create-answer",
                    questionId: answer.questionId,
                    replyToAnswer: answer.id,
                  }}
                  onCancel={() => setIsReplyOpen(false)}
                  onSuccess={() => {
                    setIsReplyOpen(false);
                    setRepliedAnswerId(answer.id);
                  }}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
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
                        isCurrentAuthor={
                          Boolean(userId) && userId === repliedAnswer.author.id
                        }
                        isAnswerByQuestionAuthor={
                          Boolean(questionAuthorId) &&
                          repliedAnswer.author.id === questionAuthorId
                        }
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

export default function AnswerNewCard(props: AnswerNewCardProps) {
  return <AnswerComponent {...props} />;
}
