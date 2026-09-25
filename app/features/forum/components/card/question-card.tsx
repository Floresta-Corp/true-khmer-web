import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { formatMinutesOrHoursAgo } from "~/lib/time";
import { resolveImageURL } from "~/lib/utils";
import type { QuestionResponse } from "~/types/api-client";
import type { CategoriesPicker } from "~/features/forum/types";
import type { ReportReasonData } from "../dialog/forum-report-dialog";
import ShareQuestionDialog from "../dialog/share-question-dialog";
import QuestionVoteComponent from "../question-vote-component";
import QuestionActionsDropdown from "../question-actions-dropdown";
import SaveQuestionButton from "../save-question-button";
import { motion, useReducedMotion } from "motion/react";
import { ImageLightbox } from "~/components/image-lightbox";
import ProfileLinkWrapper from "~/components/profile-link-wrapper";

interface QuestionCardProps {
  question: QuestionResponse;
  categories: CategoriesPicker[];
  userId?: string;
  index?: number;
  actions?: React.ReactNode;
  reportReasons?: ReportReasonData[];
}

export default function QuestionCard({
  question,
  categories,
  userId,
  index = 0,
  actions,
  reportReasons,
}: QuestionCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const createdAgoLabel = formatMinutesOrHoursAgo(question.createdAt);
  const profileImage = resolveImageURL(question.author.avatarKey);
  const navigate = useNavigate();
  const handleGoToDetail = () => {
    navigate(`/forum/detail/${question.id}`);
  };

  const isCurrentAuthor = Boolean(userId) && userId === question.author.id;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <motion.article
      className="w-full rounded-2xl border border-[#eef1f6] bg-white p-4 shadow-[0px_2px_16px_0px_rgba(15,23,41,0.03)] sm:p-5"
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.1,
        delay: prefersReducedMotion ? 0 : index * 0.02,
      }}
    >
      {/* Header with author info */}
      <div className="mb-3 flex items-start justify-between gap-3 sm:mb-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="size-10 shrink-0 border border-[#f3f4f6]">
            <AvatarImage
              src={profileImage}
              alt={question.author.name}
              className="object-cover"
            />
          </Avatar>

          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
            <ProfileLinkWrapper
              authorId={question.author.id}
              isAuthor={isCurrentAuthor}
              className="truncate text-sm font-semibold text-[#0f1729]"
            >
              {question.author.name}
            </ProfileLinkWrapper>

            <span className="hidden text-xs text-[#9eacc0] sm:inline">in</span>
            <Link
              to={`/forum?categoryId=${question.category.id}`}
              className="inline-flex max-w-full truncate text-sm font-semibold text-[#2f6fe4] hover:text-blue-700"
            >
              {question.category.name}
            </Link>

            <span className="text-xs text-[#9eacc0]">•</span>
            <span className="text-xs text-[#9eacc0]">{createdAgoLabel}</span>

            {isCurrentAuthor && (
              <div className="bg-brand-light-blue dark:bg-brand-blue/20 text-brand-blue border-brand-blue/10 rounded border px-1.5 py-0.5 text-[10px] font-bold tracking-widest uppercase">
                Author
              </div>
            )}
          </div>
        </div>

        {/* Save + actions menu */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-1">
          {actions}

          <SaveQuestionButton
            question={question}
            isAuthenticated={Boolean(userId)}
          />

          <QuestionActionsDropdown
            question={question}
            categories={categories}
            isCurrentAuthor={isCurrentAuthor}
            isAuthenticated={Boolean(userId)}
            reportReasons={reportReasons}
          />
        </div>
      </div>

      {/* Question Title */}
      <h2
        onClick={handleGoToDetail}
        className="mb-2 cursor-pointer text-base leading-snug font-semibold text-[#0f1729] transition-colors hover:text-[#2f6fe4] sm:text-lg"
      >
        {question.title}
      </h2>

      {/* Question Body */}
      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-[#48566a] sm:mb-4 sm:text-sm">
        {question.body}
      </p>

      {question.imageKey && (
        <>
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            className="w-full bg-transparent p-0"
            aria-label="Open image preview"
          >
            <img
              src={resolveImageURL(question.imageKey)}
              alt="Question image"
              className="aspect-video w-full rounded-xl object-cover sm:mb-4"
            />
          </button>

          {lightboxIndex !== null && (
            <ImageLightbox
              images={[resolveImageURL(question.imageKey)]}
              initialIndex={lightboxIndex}
              alt={question.title}
              onClose={() => setLightboxIndex(null)}
            />
          )}
        </>
      )}

      {/* Tags */}
      {question.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-x-2 gap-y-1 sm:mb-4">
          {question.tags.slice(0, 5).map((tag) => (
            <span key={tag.id} className="text-xs text-[#99a1af]">
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="my-3 border-t border-[#f9fafb] sm:my-4" />

      {/* Footer with vote, answer count, and share */}
      <div className="flex shrink-0 items-center gap-4 sm:justify-start sm:gap-3.5">
        <QuestionVoteComponent
          question={question}
          className="h-8 rounded-full border border-[#e9eef5] bg-white"
        />

        <button
          onClick={handleGoToDetail}
          className="group inline-flex cursor-pointer items-center gap-2 rounded-lg text-xs font-medium text-[#48566A] transition-colors hover:text-blue-600 sm:text-sm"
        >
          <MessageCircle
            size={18}
            className="text-[#48566A] transition-colors group-hover:text-blue-600"
          />
          <span>
            {`${question.answerCount} ${
              question.answerCount > 1 ? "answers" : "answer"
            }`}
          </span>
        </button>
        <ShareQuestionDialog question={question} />
      </div>
    </motion.article>
  );
}
