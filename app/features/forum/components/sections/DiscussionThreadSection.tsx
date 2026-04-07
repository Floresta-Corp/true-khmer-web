import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type {
  CategoriesPicker,
  Question,
  QuestionSortBy,
} from "~/services/forum/types";
import LoadMore from "../LoadMore";
import QuestionCardSkeleton from "../card/QuestionCardSkeleton";
import QuestionCard from "../card/QuestionCard";
import { useLoaderData } from "react-router";
import type { loader } from "../../routes/forum";
import MyActivityAnswerList from "./MyActivityAnswerList";
import ThreadsTitle from "./ThreadsTitle";

interface DiscussionThreadSectionProps {
  categories?: CategoriesPicker[];
  data?: {
    questions: Question[] | undefined;
    hasMore: boolean | undefined;
  };
  activeTab: QuestionSortBy;
  onTabChange?: (tab: QuestionSortBy) => void;
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
  const { userId } = useLoaderData<typeof loader>();

  const tabs: Array<{
    id: QuestionSortBy;
    label: string;
  }> = [
    { id: "recent", label: "Recent" },
    { id: "topRated", label: "Top Rated" },
    { id: "unanswered", label: "Unanswered" },
    ...(userId ? [{ id: "myActivity" as const, label: "My Activity" }] : []),
  ];

  const isMyActivityTab = activeTab === "myActivity" && userId ? true : false;

  return (
    <div className="flex-1 w-full min-w-0">
      <div className="overflow-x-auto pb-0.5">
        <Tabs
          className="mb-3.5"
          value={activeTab}
          onValueChange={(value) => onTabChange?.(value as QuestionSortBy)}
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

      {/* Listing Answer but only for tab My Activity Only */}
      {isMyActivityTab && <MyActivityAnswerList isLoading={isLoading} />}

      {/* Discussion posts */}
      {isMyActivityTab && <ThreadsTitle />}
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
          <div className="text-center py-12 text-[#9eacc0]">
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
