import {
  Bookmark,
  Clock,
  MessageSquare,
  Pencil,
  Share2,
  Trash2,
} from "lucide-react";
import { Link, useLoaderData } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import QuestionVoteComponent from "../QuestionVoteComponent";
import type { CategoriesPicker, Question } from "~/services/forum/types";
import type { AuthenticatedUser } from "~/lib/server/types";
import { formatMinutesOrHoursAgo } from "~/lib/time";
import AskQuestionDialog from "../dialog/AskQuestionDialog";
import DeleteQuestionDialog from "../dialog/DeleteQuestionDialog";
import ReportQuestionDialog from "../dialog/ReportQuestionDialog";
import { resolveImageURL } from "~/lib/utils";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import type { loader } from "../../routes/forum";

interface DiscussionCardProps {
  question: Question;
  categories: CategoriesPicker[];
  onCategoryClick?: (category: CategoriesPicker) => void;
}

export default function QuestionCard({
  question,
  categories,
  onCategoryClick,
}: DiscussionCardProps) {
  const { userId } = useLoaderData<typeof loader>();
  const createdAgoLabel = formatMinutesOrHoursAgo(question.createdAt);
  const isCurrentAuthor = userId === question.author.id;
  const profileImage = resolveImageURL(question.author.avatarKey);

  return (
    <div className="bg-white border border-[#f1f5f9] rounded-2xl p-4 sm:p-6 w-full hover:shadow-sm transition-shadow">
      {/* Header with category and metadata */}
      <div className="flex justify-between items-start mb-3 sm:mb-5 gap-2">
        <div className="flex gap-2 items-center flex-wrap">
          <Button
            onClick={() =>
              onCategoryClick?.({
                id: question.category.id,
                name: question.category.name,
              } as CategoriesPicker)
            } // Placeholder, replace with actual category object
            variant="ghost"
            className="h-auto px-0 py-0 text-xs font-bold text-[#2f6fe4] hover:underline"
          >
            {question.category.name}
          </Button>
          {isCurrentAuthor && (
            <Badge
              variant="secondary"
              className="text-xs font-semibold bg-green-100 text-green-500"
            >
              Author
            </Badge>
          )}
        </div>

        {/* Time and action buttons */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <Clock size={16} className="text-[#9EACC0]" />
          <span className="text-xs text-[#9eacc0] hidden sm:block">
            {createdAgoLabel}
          </span>
        </div>
      </div>

      {/* Date visible on mobile only */}
      <p className="text-xs text-[#9eacc0] mb-2 sm:hidden">{createdAgoLabel}</p>

      {/* Title */}
      <h2 className="text-sm sm:text-base font-semibold text-[#030213] mb-2 leading-snug">
        <Link
          to={`/forum/${question.id}`}
          className="hover:text-[#2f6fe4] transition-colors"
        >
          {question.title}
        </Link>
      </h2>

      {/* Description */}
      <p className="text-xs text-[#65758b] mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
        {question.body}
      </p>

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

      {isCurrentAuthor && (
        <div className="flex items-center justify-end">
          <div className="flex h-[26.25px] w-[59.5px] items-center gap-1.75">
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
                  className="h-[26.25px] w-[26.25px] rounded-xl bg-[#f9fafb] text-[#99a1af] hover:bg-[#f1f5f9] hover:text-[#344256]"
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
                  className="h-[26.25px] min-w-[26.25px] flex-1 rounded-xl bg-[#f9fafb] text-[#99a1af] hover:bg-[#f1f5f9] hover:text-[#344256]"
                >
                  <Trash2 size={12.25} />
                </Button>
              }
            />
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-[#f9fafb] my-3 sm:my-4" />

      {/* Footer with author and engagement */}
      <div className="flex justify-between items-center gap-2">
        {/* Author info */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <Avatar className="border border-[#f3f4f6] shrink-0">
            <AvatarImage
              src={profileImage}
              alt={question.author.name}
              className="object-cover"
            />
          </Avatar>
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-[#344256] truncate">
              {question.author.name}
            </p>
            <p className="text-xs text-[#9eacc0] hidden sm:block">
              Community Member
            </p>
          </div>
        </div>

        {/* Engagement metrics */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          <QuestionVoteComponent
            questionId={question.id}
            score={question.score}
            viewerVote={question.viewerVote}
          />

          <Link
            to={`/forum/${question.id}`}
            className="group inline-flex items-center gap-1 text-xs font-medium text-[#99a1af] px-2 py-1 rounded-lg cursor-pointer transition-colors hover:text-[#344256] active:text-[#344256]"
          >
            <MessageSquare
              size={12.25}
              className="text-[#99a1af] group-hover:text-[#344256] group-active:text-[#344256] transition-colors"
            />
            <span>
              {question.answerCount}
              <span className="hidden sm:inline"> answers</span>
              <span className="sm:hidden"> ans</span>
            </span>
          </Link>

          <div className="h-[22.75px] w-px bg-[#f3f4f6]" />

          <Button
            variant="ghost"
            size="icon"
            className="h-[22.75px] w-[22.75px] rounded-xl text-[#99a1af] hover:bg-[#f8fafc] hover:text-[#344256]"
          >
            <Bookmark size={12.25} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-[22.75px] w-[22.75px] rounded-xl text-[#99a1af] hover:bg-[#f8fafc] hover:text-[#344256]"
          >
            <Share2 size={12.25} />
          </Button>
          <ReportQuestionDialog
            questionTitle={question.title}
            isAuthenticated={Boolean(userId)}
          />
        </div>
      </div>
    </div>
  );
}
