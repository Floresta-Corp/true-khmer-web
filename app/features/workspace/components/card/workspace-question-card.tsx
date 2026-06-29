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
      className="w-full rounded-xl sm:rounded-2xl bg-white p-4 sm:p-4 lg:p-6 border border-slate-200"
    >
      <div className="flex justify-between items-start mb-3 gap-2">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
          <Avatar className="border border-[#f3f4f6] shrink-0 h-8 w-8 sm:h-10 sm:w-10">
            <AvatarImage
              src={profileImage}
              alt={question.author?.name || "User"}
              className="object-cover"
            />
          </Avatar>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <p className="text-xs sm:text-sm font-semibold text-[#344256] truncate">
                {question.author?.name}
              </p>
              <span className="hidden sm:inline text-[#d1d5db]">·</span>
              <span
                // to={`/forum?categoryId=${question.category.id}`}
                className="text-xs sm:text-sm font-semibold text-blue-600 truncate"
              >
                {question.category.name}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="hidden sm:inline text-[#d1d5db]">·</span>
              <span className="text-[10px] sm:text-xs text-[#9eacc0]">
                {createdAgoLabel}
              </span>
              <Badge className="text-[10px] sm:text-xs font-semibold bg-green-100 text-green-500 hover:bg-gray-100 px-1.5 sm:px-2">
                Author
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
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
        <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-[#030213] mb-2 leading-snug hover:text-[#2f6fe4] transition-colors">
          {question.title}
        </h2>
      </Link>

      <p className="text-xs sm:text-sm text-[#65758b] mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-3 leading-relaxed">
        {question.body}
      </p>

      {question.tags && question.tags.length > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          {question.tags.slice(0, 6).map((tag, idx) => (
            <span
              key={tag.id}
              className={cn(
                "text-[10px] sm:text-xs text-[#99a1af] bg-[#f8fafc] border border-[#f1f5f9] rounded px-1.5 sm:px-2 py-0.5",
                idx >= 3 ? "hidden sm:inline-block" : "inline-block",
              )}
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
          aria-label={`${question.answerCount} answers`}
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
