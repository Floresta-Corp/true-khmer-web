import { Button } from "~/components/ui/button";
import QuestionCardSkeleton from "../card/question-card-skeleton";
import ForumTopCategoriesCard from "../card/forum-top-categories-card";
import TrendingTopics from "./trending-topics";

import type {
  CategoriesPicker,
  Question,
  QuestionSortBy,
  Tag,
} from "~/services/forum/forum-types";
import ForumRightSidebar from "./forum-right-sidebar";
import YourActivitiesCard from "../card/your-activities-card";
import MobileQuestionFilter from "../mobile-question-filter";
import QuestionSortByDropdown from "../question-sort-by-dropdown";
import QuestionCard from "../card/question-card";
import { useLoaderData } from "react-router";
import type { loader } from "../../routes/forum.new";

interface ForumContentNewProps {
  questions?: Question[];
  categories: CategoriesPicker[];
  selectedCategory: CategoriesPicker;
  onCategorySelect: (category: CategoriesPicker) => void;
  activeTab: ForumQuestionTab;
  setActiveTab: (tab: ForumQuestionTab) => void;
  sortBy: QuestionSortBy;
  setSortBy: (sortBy: QuestionSortBy) => void;
  tags?: Tag[];
  selectedTagId?: string;
  onTagSelect?: (tag: Tag) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

export type ForumQuestionTab = "recent" | "topRated" | "unanswered";

const tabItems: Array<{ label: string; value: ForumQuestionTab }> = [
  { label: "All", value: "recent" },
  { label: "Trending", value: "topRated" },
  { label: "Unanswered", value: "unanswered" },
];

export default function ForumContentNew({
  questions,
  categories,
  selectedCategory,
  onCategorySelect,
  activeTab,
  setActiveTab,
  sortBy,
  setSortBy,
  tags,
  selectedTagId,
  onTagSelect,
  onLoadMore,
  hasMore,
  isLoading,
}: ForumContentNewProps) {
  const { userId } = useLoaderData<typeof loader>();
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
                      className={`cursor-pointer rounded-full px-6 py-2.5 text-sm font-medium transition-colors ${
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
                <MobileQuestionFilter
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              </div>
            </div>

            <div>
              <QuestionSortByDropdown
                selectedValue={sortBy}
                onSelect={setSortBy}
              />
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {isLoading && questions?.length === 0
              ? Array.from({ length: 4 }).map((_, index) => (
                  <QuestionCardSkeleton key={`question-skeleton-${index}`} />
                ))
              : questions?.map((question, index) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    userId={userId ?? undefined}
                    categories={categories}
                    index={index}
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
