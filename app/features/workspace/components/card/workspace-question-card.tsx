import { Pencil, Trash2, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import SlideToLeftHoverAnimation from "~/components/slide-to-left-hover-animation";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import AskQuestionDialog from "~/features/forum/components/dialog/ask-question-dialog";
import DeleteQuestionDialog from "~/features/forum/components/dialog/delete-question-dialog";
import ShareQuestionDialog from "~/features/forum/components/dialog/share-question-dialog";
import QuestionVoteComponent from "~/features/forum/components/question-vote-component";
import { formatMinutesOrHoursAgo } from "~/lib/time";
import { resolveImageURL, cn } from "~/lib/utils";
import type { QuestionResponse } from "~/types/api-client";
import type { BasicJoinType } from "~/services/types";

type Props = {
  question: QuestionResponse;
  index?: number;
  categories?: BasicJoinType[];
};

export default function WorkspaceQuestionItem({
  question,
  index = 0,
  categories,
}: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const handleGoToDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/forum/detail/${question.id}`);
  };
  const createdAgoLabel = formatMinutesOrHoursAgo(question.createdAt);
  const profileImage = question.author?.avatarKey
    ? resolveImageURL(question.author.avatarKey)
    : "";

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.07,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      onHoverStart={() => {
        setIsHovered(true);
      }}
      onHoverEnd={() => {
        setIsHovered(false);
      }}
      className="w-full rounded-xl border border-slate-200 bg-white p-4 sm:rounded-2xl sm:p-4 lg:p-6"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-2.5">
          <Avatar className="h-8 w-8 shrink-0 border border-[#f3f4f6] sm:h-10 sm:w-10">
            <AvatarImage
              src={profileImage}
              alt={question.author?.name || "User"}
              className="object-cover"
            />
          </Avatar>

          <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <p className="truncate text-xs font-semibold text-[#344256] sm:text-sm">
                {question.author?.name}
              </p>
              <span className="hidden text-[#d1d5db] sm:inline">·</span>
              <span
                // to={`/forum?categoryId=${question.category.id}`}
                className="truncate text-xs font-semibold text-blue-600 sm:text-sm"
              >
                {question.category.name}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="hidden text-[#d1d5db] sm:inline">·</span>
              <span className="text-[10px] text-[#9eacc0] sm:text-xs">
                {createdAgoLabel}
              </span>
              <Badge className="bg-green-100 px-1.5 text-[10px] font-semibold text-green-500 hover:bg-gray-100 sm:px-2 sm:text-xs">
                Author
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <div className="flex items-center justify-end">
            <SlideToLeftHoverAnimation isHovered={isHovered}>
              <AskQuestionDialog
                categories={(categories ?? []).filter(
                  (category) => category.id !== "all-categories",
                )}
                isEditing
                // The forum dialogs are typed on forum-types `Question`; the
                // "my questions" API returns the api-client `QuestionResponse`.
                // Both share every field these dialogs read.
                data={question}
                aria-label="Edit Question"
                trigger={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-[26.25px] w-[26.25px] rounded-xl bg-[#f9fafb] text-[#99a1af] hover:bg-[#f1f5f9] hover:text-[#344256]"
                  >
                    <Pencil size={12.25} aria-label="Edit Question" />
                  </Button>
                }
              />
              <DeleteQuestionDialog
                questionId={question.id}
                aria-label="Delete Question"
                trigger={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-[26.25px] min-w-[26.25px] flex-1 rounded-xl bg-[#f9fafb] text-[#99a1af] hover:bg-[#f1f5f9] hover:text-[#344256]"
                  >
                    <Trash2 size={12.25} aria-label="Delete Question" />
                  </Button>
                }
              />
            </SlideToLeftHoverAnimation>
          </div>
        </div>
      </div>

      <Link to={`/forum/detail/${question.id}`}>
        <h2 className="mb-2 text-sm leading-snug font-semibold text-[#030213] transition-colors hover:text-[#2f6fe4] sm:text-base lg:text-lg">
          {question.title}
        </h2>
      </Link>

      <p className="mb-2 line-clamp-2 text-xs leading-relaxed text-[#65758b] sm:mb-3 sm:line-clamp-3 sm:text-sm">
        {question.body}
      </p>

      {question.tags && question.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {question.tags.slice(0, 6).map((tag, idx) => (
            <span
              key={tag.id}
              className={cn(
                "rounded px-1.5 py-0.5 text-[10px] text-[#99a1af] sm:px-2 sm:text-xs",
                idx >= 3 ? "hidden sm:inline-block" : "inline-block",
              )}
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="my-3 border-t border-[#f9fafb] sm:my-4" />

      {/* Footer with vote, answer count, and share */}
      <div className="flex shrink-0 items-center gap-4 sm:gap-3.5">
        <QuestionVoteComponent question={question} className="h-7.5" />

        <button
          aria-label={`${question.answerCount} ${
            question.answerCount === 1 ? "answer" : "answers"
          }`}
          onClick={handleGoToDetail}
          className="group inline-flex cursor-pointer items-center gap-2 rounded-lg text-xs text-[14px] font-medium text-[#48566A] transition-colors hover:text-blue-600"
        >
          <MessageCircle
            size={20}
            className="text-[#48566A] transition-colors group-hover:text-blue-600"
          />
          <span>
            {`${question.answerCount} ${
              question.answerCount === 1 ? "answer" : "answers"
            }`}
          </span>
        </button>

        <ShareQuestionDialog question={question} />
      </div>
    </motion.article>
  );
}
