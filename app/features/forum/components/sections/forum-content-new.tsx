import {
  ChevronDown,
  MessageCircle,
  Share2,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import QuestionCardSkeleton from "../card/question-card-skeleton";
import ForumTopCategoriesCard from "../card/forum-top-categories-card";
import TrendingTopics from "./trending-topics";
import { formatMinutesOrHoursAgo } from "~/lib/time";
import { resolveImageURL } from "~/lib/utils";
import type {
  CategoriesPicker,
  Question,
  QuestionSortBy,
  Tag,
} from "~/services/forum/forum-types";
import ForumRightSidebar from "./forum-right-sidebar";
import YourActivitiesCard from "../card/your-activities-card";

interface ForumContentNewProps {
  questions?: Question[];
  categories: CategoriesPicker[];
  selectedCategory: CategoriesPicker;
  onCategorySelect: (category: CategoriesPicker) => void;
  activeTab: QuestionSortBy;
  setActiveTab: (tab: QuestionSortBy) => void;
  tags?: Tag[];
  selectedTagId?: string;
  onTagSelect?: (tag: Tag) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

const tabItems: Array<{ label: string; value: QuestionSortBy }> = [
  { label: "All", value: "recent" },
  { label: "Trending", value: "topRated" },
  { label: "Latest", value: "recent" },
  { label: "Unanswered", value: "unanswered" },
];

function DiscussionCard({ question }: { question: Question }) {
  const createdAgoLabel = formatMinutesOrHoursAgo(question.createdAt);
  const profileImage = resolveImageURL(question.author.avatarKey);
  const navigate = useNavigate();
  const handleGoToDetail = () => {
    navigate(`/forum/${question.id}`);
  };

  return (
    <article className="w-full rounded-2xl bg-white p-6 shadow-[0px_4px_24px_0px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3 text-sm">
          <Avatar className="size-6 border border-[#f1f5f9]">
            <AvatarImage src={profileImage} alt={question.author.name} />
          </Avatar>
          <div className="min-w-0 text-[#595c5e]">
            <span className="font-semibold text-[#2c2f31]">
              {question.author.name}
            </span>
            <span className="mx-1">•</span>
            <span className="font-semibold text-[#1c5dd4] ">
              {question.category.name}
            </span>
            <span className="mx-1">•</span>
            <span>{createdAgoLabel}</span>
          </div>
        </div>

        {question.author.id === question.id && (
          <Badge className="bg-[#ceffe5] text-[#19a95e] hover:bg-[#ceffe5]">
            Author
          </Badge>
        )}
      </div>

      <h3
        onClick={handleGoToDetail}
        className="mt-3 cursor-pointer text-[22px] font-bold leading-8.25 text-[#2c2f31] transition-colors hover:text-[#1c5dd4]"
      >
        {question.title}
      </h3>
      <p className="mt-3 text-sm leading-5.25 text-[#595c5e] line-clamp-2">
        {question.body}
      </p>

      {question.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {question.tags.slice(0, 4).map((tag) => (
            <span
              key={tag.id}
              className="text-xs font-medium tracking-[0.1172px] text-[#99a1af]"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-5 text-[#48566a]">
        <div className="inline-flex h-7.5 items-center rounded-xl border border-[#f3f4f6] bg-[#f9fafb] p-px">
          <button
            type="button"
            className="inline-flex size-7 items-center justify-center rounded-[11px] bg-[#ecfdf5] text-[#009966]"
          >
            <ThumbsUp className="size-3.5" />
          </button>
          <span className="px-2 text-xs font-semibold text-[#009966]">
            {question.upvoteCount}
          </span>
          <button
            type="button"
            className="inline-flex size-7 items-center justify-center rounded-[11px] text-[#9aa1af]"
          >
            <ThumbsDown className="size-3.5" />
          </button>
        </div>

        <div
          onClick={handleGoToDetail}
          className="inline-flex cursor-pointer items-center gap-2 text-sm font-bold transition-colors hover:text-[#1c5dd4]"
        >
          <MessageCircle className="size-4.5" />
          {question.answerCount} answers
        </div>

        <div className="inline-flex items-center gap-2 text-sm font-medium">
          <Share2 className="size-4.5" />
          Share
        </div>
      </div>
    </article>
  );
}

export default function ForumContentNew({
  questions,
  categories,
  selectedCategory,
  onCategorySelect,
  activeTab,
  setActiveTab,
  tags,
  selectedTagId,
  onTagSelect,
  onLoadMore,
  hasMore,
  isLoading,
}: ForumContentNewProps) {
  const list = questions ?? [];

  return (
    <section className="bg-[#f8fafc] px-4 py-10 md:px-10 lg:px-30">
      <div className="mx-auto flex w-full max-w-300 gap-10">
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {tabItems.map((tab) => {
                const isActive = activeTab === tab.value;
                return (
                  <button
                    key={`${tab.label}-${tab.value}`}
                    type="button"
                    onClick={() => setActiveTab(tab.value)}
                    className={`rounded-full px-6 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#0050d4] text-[#f1f2ff]"
                        : "bg-[#eef1f3] text-[#595c5e] hover:bg-[#e2e8f0]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0050d4]"
            >
              Most relevant
              <ChevronDown className="size-5 text-[#0050d4]" />
            </button>
          </div>

          <div className="flex flex-col gap-5">
            {isLoading && list.length === 0
              ? Array.from({ length: 4 }).map((_, index) => (
                  <QuestionCardSkeleton key={`question-skeleton-${index}`} />
                ))
              : list.map((question) => (
                  <DiscussionCard key={question.id} question={question} />
                ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onLoadMore}
                disabled={isLoading}
                className="h-10 rounded-xl border-[#dbe3ee] px-6"
              >
                {isLoading ? "Loading..." : "Load more discussions"}
              </Button>
            </div>
          )}
        </div>

        <aside className="hidden w-70 shrink-0 lg:block space-y-5">
          <YourActivitiesCard />
          <ForumTopCategoriesCard
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={onCategorySelect}
          />
          <TrendingTopics
            tags={tags}
            selectedTagId={selectedTagId}
            onTagSelect={onTagSelect}
          />
          <ForumRightSidebar hideGuidelines />
        </aside>
      </div>
    </section>
  );
}
