import { Pencil, Trash2, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { formatMinutesOrHoursAgo } from "~/lib/time";
import { resolveImageURL } from "~/lib/utils";
import type { QuestionResponse } from "~/types/api-client";
import type { CategoriesPicker } from "~/features/forum/types";
import AskQuestionDialog from "../dialog/ask-question-dialog";
import DeleteQuestionDialog from "../dialog/delete-question-dialog";
import ShareQuestionDialog from "../dialog/share-question-dialog";
import QuestionVoteComponent from "../question-vote-component";
import MobileAuthorOptions from "../mobile-author-options";
import { motion, useReducedMotion } from "motion/react";
import { ImageLightbox } from "~/components/image-lightbox";
import ProfileLinkWrapper from "~/components/profile-link-wrapper";

interface QuestionCardProps {
  question: QuestionResponse;
  categories: CategoriesPicker[];
  userId?: string;
  index?: number;
}

export default function QuestionCard({
  question,
  categories,
  userId,
  index = 0,
}: QuestionCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const createdAgoLabel = formatMinutesOrHoursAgo(question.createdAt);
  const profileImage = resolveImageURL(question.author.avatarKey);
  const navigate = useNavigate();
  const handleGoToDetail = () => {
    navigate(`/forum/detail/${question.id}`);
  };

  const isCurrentAuthor = Boolean(userId) && userId === question.author.id;
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <motion.article
      className="w-full rounded-2xl bg-white p-4 shadow-[0px_4px_24px_0px_rgba(0,0,0,0.04)] sm:p-6 border border-slate-200"
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.1,
        delay: prefersReducedMotion ? 0 : index * 0.02,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Header with author info */}
      <div className="flex justify-between items-start mb-3 sm:mb-5 gap-2">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <Avatar className="border border-[#f3f4f6] shrink-0">
            <AvatarImage
              src={profileImage}
              alt={question.author.name}
              className="object-cover"
            />
          </Avatar>
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <ProfileLinkWrapper
                authorId={question.author.id}
                isAuthor={userId === question.author.id ? true : false}
                className="text-xs sm:text-sm font-semibold text-[#344256] truncate"
              >
                {question.author.name}
              </ProfileLinkWrapper>
              <span className="hidden text-[#d1d5db] sm:inline">·</span>
              <Link
                to={`/forum?categoryId=${question.category.id}`}
                className="inline-flex h-auto max-w-full truncate p-0 text-sm font-semibold text-blue-600"
              >
                {question.category.name}
              </Link>
              <span className="hidden text-[#d1d5db] sm:inline">·</span>
              <span className="text-xs text-[#9eacc0]">{createdAgoLabel}</span>
              {isCurrentAuthor && (
                <Badge
                  variant="secondary"
                  className="text-xs font-semibold bg-green-100 text-green-500"
                >
                  Author
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Edit/Delete actions */}
        {isCurrentAuthor ? (
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Mobile: Dropdown menu */}
            <div className="sm:hidden">
              <MobileAuthorOptions
                question={question}
                categories={categories}
              />
            </div>

            {/* Desktop: Inline buttons with animation */}
            <div className="hidden sm:block">
              <motion.div
                className="flex items-center gap-1.5"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
                transition={{ duration: 0.2 }}
              >
                <AskQuestionDialog
                  categories={categories.filter(
                    (category) => category.id !== "all-categories",
                  )}
                  isEditing
                  data={question}
                  trigger={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-[26.25px] w-[26.25px] rounded-xl bg-[#f9fafb] text-[#99a1af] hover:bg-[#f1f5f9] hover:text-[#344256] cursor-pointer"
                      aria-label="Edit question"
                    >
                      <Pencil size={12.25} />
                    </Button>
                  }
                />
                <DeleteQuestionDialog
                  questionId={question.id}
                  trigger={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-[26.25px] min-w-[26.25px] flex-1 rounded-xl bg-[#f9fafb] text-[#99a1af] hover:bg-[#f1f5f9] hover:text-[#344256] cursor-pointer"
                      aria-label="Delete question"
                    >
                      <Trash2 size={12.25} />
                    </Button>
                  }
                />
              </motion.div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Question Title */}
      <h2
        onClick={handleGoToDetail}
        className="text-sm sm:text-2xl font-semibold text-[#030213] mb-2 leading-snug cursor-pointer hover:text-[#2f6fe4] transition-colors"
      >
        {question.title}
      </h2>

      {/* Question Body */}
      <p className="text-xs sm:text-sm text-[#65758b] mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
        {question.body}
      </p>

      {question.imageKey && (
        <>
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            className="w-full p-0 bg-transparent"
            aria-label="Open image preview"
          >
            <img
              src={resolveImageURL(question.imageKey)}
              alt="Question image"
              className="aspect-video object-cover rounded-xl sm:mb-4 w-full"
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
        <div className="flex gap-1.5 sm:gap-2 mb-3 sm:mb-4 flex-wrap">
          {question.tags.slice(0, 5).map((tag) => (
            <span
              key={tag.id}
              className="text-xs text-[#99a1af] bg-[#f8fafc] border border-[#f1f5f9] rounded-md px-2 py-0.5"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-[#f9fafb] my-3 sm:my-4" />

      {/* Footer with vote, answer count, and share */}
      <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
        <QuestionVoteComponent question={question} className="h-7.5" />

        <button
          onClick={handleGoToDetail}
          className="group inline-flex items-center gap-2 text-xs font-medium text-[#48566A] text-[14px] rounded-lg cursor-pointer transition-colors hover:text-blue-600"
        >
          <MessageCircle
            size={20}
            className="text-[#48566A] group-hover:text-blue-600 transition-colors"
          />
          <span>
            {question.answerCount}
            <span className="hidden sm:inline"> answers</span>
            <span className="sm:hidden"> ans</span>
          </span>
        </button>
        <ShareQuestionDialog question={question} />
      </div>
    </motion.article>
  );
}
