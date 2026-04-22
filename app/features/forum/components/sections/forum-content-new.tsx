import {
  ChevronDown,
  MessageCircle,
  Share2,
  ThumbsDown,
  ThumbsUp,
  Pencil,
  Trash2,
} from "lucide-react";
import { useNavigate, useLoaderData } from "react-router";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
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
import AskQuestionDialog from "../dialog/ask-question-dialog";
import DeleteQuestionDialog from "../dialog/delete-question-dialog";

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
  { label: "Unanswered", value: "unanswered" },
];

function DiscussionCard({
  question,
  categories,
}: {
  question: Question;
  categories: CategoriesPicker[];
}) {
  const { userId } = useLoaderData() as any;
  const createdAgoLabel = formatMinutesOrHoursAgo(question.createdAt);
  const profileImage = resolveImageURL(question.author.avatarKey);
  const navigate = useNavigate();
  const handleGoToDetail = () => {
    navigate(`/forum/${question.id}`);
  };

  const isCurrentAuthor = Boolean(userId) && userId === question.author.id;

  return (
    <article className="w-full rounded-2xl bg-white p-6 shadow-[0px_4px_24px_0px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3 text-sm">
          <Avatar className="size-6 border border-[#f1f5f9]">
            <AvatarImage src={profileImage} alt={question.author.name} />
          </Avatar>
          <div className="min-w-0 text-[#595c5e]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="font-semibold text-[#2c2f31] truncate">
                {question.author.name}
              </span>
              <div className="flex items-center text-sm text-[#595c5e] mt-1 sm:mt-0">
                <span className="font-semibold text-[#1c5dd4] mr-2">
                  {question.category.name}
                </span>
                <span className="text-xs">{createdAgoLabel}</span>
              </div>
            </div>
          </div>
        </div>

        {isCurrentAuthor && (
          <div className="flex items-center gap-1.5">
            <Badge className="bg-[#ceffe5] text-[#19a95e] hover:bg-[#ceffe5]">
              Author
            </Badge>

            <div className="flex items-center gap-1.5">
              {/* Inline actions for sm+ */}
              <div className="hidden sm:flex items-center gap-1.5">
                <AskQuestionDialog
                  categories={categories.filter(
                    (c) => c.id !== "all-categories",
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
              </div>

              {/* Dropdown for xs screens */}
              <div className="sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-xl bg-[#f9fafb] text-[#99a1af] hover:bg-[#f1f5f9] hover:text-[#344256]"
                      aria-label="More actions"
                    >
                      <ChevronDown className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <div className="w-full px-3 py-2">
                        <AskQuestionDialog
                          categories={categories.filter(
                            (c) => c.id !== "all-categories",
                          )}
                          isEditing
                          data={question}
                          trigger={<span className="w-full">Edit</span>}
                        />
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <div className="w-full px-3 py-2">
                        <DeleteQuestionDialog
                          questionId={question.id}
                          trigger={<span className="w-full">Delete</span>}
                        />
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
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
  return (
    <section className="bg-[#f8fafc] px-4 py-10 md:px-10 lg:px-30">
      <div className="mx-auto flex w-full max-w-300 gap-10">
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Tabs: inline on sm+, dropdown on xs */}
              <div className="hidden sm:flex flex-wrap items-center gap-2">
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

              <div className="sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="rounded-full px-4 py-2.5 text-sm"
                    >
                      {tabItems.find((t) => t.value === activeTab)?.label ??
                        tabItems[0].label}
                      <ChevronDown className="ml-2 size-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {tabItems.map((tab) => (
                      <DropdownMenuItem
                        key={tab.value}
                        onSelect={() => setActiveTab(tab.value)}
                      >
                        {tab.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
            {isLoading && questions?.length === 0
              ? Array.from({ length: 4 }).map((_, index) => (
                  <QuestionCardSkeleton key={`question-skeleton-${index}`} />
                ))
              : questions?.map((question) => (
                  <DiscussionCard
                    key={question.id}
                    question={question}
                    categories={categories}
                  />
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
