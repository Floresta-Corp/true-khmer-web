import {
  Heart,
  MessageSquare,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import type { Question } from "~/services/forum/types";

interface DiscussionCardProps {
  question: Question;
  onCategoryClick?: (category: string) => void;
}

export default function QuestionCard({
  question,
  onCategoryClick,
}: DiscussionCardProps) {
  const createdLabel = new Date(question.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <div className="bg-white border border-[#f1f5f9] rounded-2xl p-4 sm:p-6 w-full hover:shadow-sm transition-shadow">
      {/* Header with category and metadata */}
      <div className="flex justify-between items-start mb-3 sm:mb-5 gap-2">
        <div className="flex gap-2 items-center flex-wrap">
          <Button
            onClick={() => onCategoryClick?.(question.category.name)}
            variant="ghost"
            className="h-auto px-0 py-0 text-xs font-bold text-[#2f6fe4] hover:underline"
          >
            {question.category.name}
          </Button>
          {question.status && (
            <Badge
              variant="secondary"
              className="text-xs font-semibold bg-[#f0f6ff] text-[#2f6fe4]"
            >
              {question.status}
            </Badge>
          )}
        </div>

        {/* Time and action buttons */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <span className="text-xs text-[#9eacc0] hidden sm:block">
            {createdLabel}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-[#f8fafc] rounded transition-colors"
          >
            <Heart size={15} className="text-[#ccc]" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-[#f8fafc] rounded transition-colors"
          >
            <MessageSquare size={15} className="text-[#ccc]" />
          </Button>
        </div>
      </div>

      {/* Date visible on mobile only */}
      <p className="text-xs text-[#9eacc0] mb-2 sm:hidden">{createdLabel}</p>

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
          {question.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs text-[#99a1af] bg-[#f8fafc] border border-[#f1f5f9] rounded-md px-2 py-0.5"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-[#f9fafb] my-3 sm:my-4" />

      {/* Footer with author and engagement */}
      <div className="flex justify-between items-center gap-2">
        {/* Author info */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <img
            src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(question.author.name)}`}
            alt={question.author.name}
            className="w-7 h-7 rounded-full border border-[#f3f4f6] shrink-0"
          />
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
          <div className="flex h-7 items-center gap-1 rounded-lg border border-[#f3f4f6] bg-[#f9fafb] px-2 sm:px-3">
            <Heart size={13} className="text-[#1fc16b]" />
            <span className="text-xs font-semibold text-[#1fc16b]">0</span>
            <ChevronDown size={13} className="text-[#99a1af]" />
          </div>

          <div className="text-xs text-[#9eacc0]">
            {question.answerCount}
            <span className="hidden sm:inline"> answers</span>
            <span className="sm:hidden"> ans</span>
          </div>

          <Button variant="ghost" size="sm" className="h-auto p-0">
            <MoreHorizontal size={15} className="text-[#99a1af]" />
          </Button>
        </div>
      </div>
    </div>
  );
}
