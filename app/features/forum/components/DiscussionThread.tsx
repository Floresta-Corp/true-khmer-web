import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { CategoriesPicker, Question } from "~/services/forum/types";
import LoadMore from "./LoadMore";
import QuestionCard from "./QuestionCard";
import type { AuthenticatedUser } from "~/lib/server/route-guards.server";

export interface DiscussionPost {
  id: string;
  category: string;
  badge?: string;
  badgeColor?: string;
  title: string;
  description: string;
  tags: string[];
  timeAgo: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  likes: number;
  answers: number;
}

interface DiscussionThreadProps {
  user: AuthenticatedUser;
  categories?: CategoriesPicker[];
  data?: {
    questions: Question[] | undefined;
    hasMore: boolean | undefined;
  };
  activeTab: "recent" | "topRated" | "unanswered" | "myActivity";
  onTabChange?: (
    tab: "recent" | "topRated" | "unanswered" | "myActivity",
  ) => void;
  onCategoryClick?: (category: CategoriesPicker) => void;
  onLoadMore?: () => void;
  isLoading?: boolean;
}

export function DiscussionThread({
  user,
  categories,
  data,
  activeTab,
  onTabChange,
  onCategoryClick,
  onLoadMore,
  isLoading,
}: DiscussionThreadProps) {
  const questions = data?.questions ?? [];
  const hasQuestions = questions.length > 0;
  const isEmptyAndLoading = !hasQuestions && Boolean(isLoading);

  const tabs: Array<{ id: DiscussionThreadProps["activeTab"]; label: string }> =
    [
      { id: "recent" as const, label: "Recent" },
      { id: "topRated" as const, label: "Top Rated" },
      { id: "unanswered" as const, label: "Unanswered" },
      { id: "myActivity" as const, label: "My Activity" },
    ];

  return (
    <div className="flex-1 w-full min-w-0">
      <div className="overflow-x-auto pb-0.5">
        <Tabs
          className="mb-3.5"
          value={activeTab}
          onValueChange={(value) =>
            onTabChange?.(value as DiscussionThreadProps["activeTab"])
          }
        >
          <TabsList variant="line" className="flex-nowrap">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="after:-bottom-px h-auto text-sm font-semibold text-[#9eacc0] whitespace-nowrap transition-colors hover:text-[#344256] data-[state=active]:text-[#2f6fe4] data-[state=active]:after:bg-[#2f6fe4]"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Discussion posts */}
      <div className="flex flex-col gap-4">
        {hasQuestions ? (
          questions.map((question) => {
            return (
              <QuestionCard
                key={question.id}
                question={question}
                categories={categories ?? []}
                onCategoryClick={onCategoryClick}
                user={user}
              />
            );
          })
        ) : isEmptyAndLoading ? (
          <div className="text-center py-12 text-[#9eacc0]">
            Loading discussions...
          </div>
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
