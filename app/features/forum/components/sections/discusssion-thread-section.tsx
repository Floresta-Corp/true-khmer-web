import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { CategoriesPicker, Question } from "~/services/forum/forum-types";
import LoadMore from "../load-more";
import QuestionCardSkeleton from "../card/question-card-skeleton";
import QuestionCard from "../card/old-question-card";

export type DiscussionThreadSectionTab = "recent" | "topRated" | "unanswered";

interface DiscussionThreadSectionProps {
  categories?: CategoriesPicker[];
  data?: {
    questions: Question[] | undefined;
    hasMore: boolean | undefined;
  };
  activeTab: DiscussionThreadSectionTab;
  onTabChange?: (tab: DiscussionThreadSectionTab) => void;
  onCategoryClick?: (category: CategoriesPicker) => void;
  onLoadMore?: () => void;
  isLoading?: boolean;
}

export function DiscussionThreadSection({
  categories,
  data,
  activeTab,
  onTabChange,
  onCategoryClick,
  onLoadMore,
  isLoading,
}: DiscussionThreadSectionProps) {
  const questions = data?.questions ?? [];
  const hasQuestions = questions.length > 0;
  const isEmptyAndLoading = !hasQuestions && Boolean(isLoading);

  const tabs: Array<{
    id: DiscussionThreadSectionTab;
    label: string;
  }> = [
    { id: "recent", label: "Recent" },
    { id: "topRated", label: "Top Rated" },
    { id: "unanswered", label: "Unanswered" },
  ];

  return (
    <div className="flex-1 w-full min-w-0">
      <div className="overflow-x-auto pb-0.5">
        <Tabs
          className="mb-3.5"
          value={activeTab}
          onValueChange={(value) =>
            onTabChange?.(value as DiscussionThreadSectionTab)
          }
        >
          <TabsList variant="line" className="flex-nowrap">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="cursor-pointer after:-bottom-px h-auto text-sm font-semibold text-[#9eacc0] whitespace-nowrap transition-colors hover:text-[#344256] data-[state=active]:text-[#2f6fe4] data-[state=active]:after:bg-[#2f6fe4]"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col gap-4">
        {hasQuestions ? (
          questions.map((question) => {
            return (
              <QuestionCard
                key={question.id}
                question={question}
                categories={categories ?? []}
                onCategoryClick={onCategoryClick}
              />
            );
          })
        ) : isEmptyAndLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <QuestionCardSkeleton key={`question-card-skeleton-${index}`} />
          ))
        ) : (
          <div className="w-full max-w-134 py-12 text-center text-[#9eacc0]">
            No discussions found
          </div>
        )}
      </div>

      {/* Load more button */}
      {data?.hasMore && (
        <LoadMore onLoadMore={onLoadMore} isLoading={isLoading} />
      )}
    </div>
  );
}
