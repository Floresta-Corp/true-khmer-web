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
      className="w-full rounded-2xl bg-white p-4 shadow-[0px_4px_24px_0px_rgba(0,0,0,0.04)] sm:p-6"
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
      <div className="mb-3 flex items-start justify-between gap-2 sm:mb-5">
        <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          <Avatar className="shrink-0 border border-[#f3f4f6]">
            <AvatarImage
              src={profileImage}
              alt={question.author.name}
              className="object-cover"
            />
          </Avatar>
          <div className="flex min-w-0 flex-col gap-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <ProfileLinkWrapper
                authorId={question.author.id}
                isAuthor={userId === question.author.id ? true : false}
                className="truncate text-xs font-semibold text-[#344256] sm:text-sm"
              >
                {question.author.name}
              </ProfileLinkWrapper>
              <span className="hidden text-[#595c5e] sm:inline">•</span>
              <span className="hidden text-sm text-[#595c5e] sm:inline">
                in
              </span>
              <Link
                to={`/forum?categoryId=${question.category.id}`}
                className="inline-flex h-auto max-w-full truncate p-0 text-sm font-semibold text-blue-600"
              >
                {question.category.name}
              </Link>
              <span className="hidden text-[#595c5e] sm:inline">•</span>
              <span className="text-xs text-[#9eacc0]">{createdAgoLabel}</span>
              {isCurrentAuthor && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-xs font-semibold text-green-500"
                >
                  Author
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Edit/Delete actions */}
        {isCurrentAuthor ? (
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
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
                      className="h-[26.25px] w-[26.25px] cursor-pointer rounded-xl bg-[#f9fafb] text-[#99a1af] hover:bg-[#f1f5f9] hover:text-[#344256]"
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
                      className="h-[26.25px] min-w-[26.25px] flex-1 cursor-pointer rounded-xl bg-[#f9fafb] text-[#99a1af] hover:bg-[#f1f5f9] hover:text-[#344256]"
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
        className="mb-2 cursor-pointer text-sm leading-snug font-semibold text-[#030213] transition-colors hover:text-[#2f6fe4] sm:text-2xl"
      >
        {question.title}
      </h2>

      {/* Question Body */}
      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-[#65758b] sm:mb-4 sm:text-sm">
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
        <div className="mb-3 flex flex-wrap gap-1.5 sm:mb-4 sm:gap-2">
          {question.tags.slice(0, 5).map((tag) => (
            <span
              key={tag.id}
              className="rounded-md px-2 py-0.5 text-xs text-[#99a1af]"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="my-3 border-t border-[#f9fafb] sm:my-4" />

      {/* Footer with vote, answer count, and share */}
      <div className="flex shrink-0 items-center gap-2 sm:justify-start sm:gap-3.5">
        <QuestionVoteComponent question={question} className="h-7.5" />

        <button
          onClick={handleGoToDetail}
          className="group inline-flex cursor-pointer items-center gap-2 rounded-lg text-xs text-[14px] font-medium text-[#48566A] transition-colors hover:text-blue-600"
        >
          <MessageCircle
            size={20}
            className="text-[#48566A] transition-colors group-hover:text-blue-600"
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
