import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "~/components/ui/button";
import QuestionCardSkeleton from "../card/question-card-skeleton";
import ForumTopCategoriesCard from "../card/forum-top-categories-card";
import TrendingTopics from "./trending-topics";

import type { QuestionResponse, TrendingTagResponse } from "~/types/api-client";
import type { CategoriesPicker, QuestionSortBy } from "~/features/forum/types";
import YourActivitiesCard from "../card/your-activities-card";
import TopContributorsCard from "../card/top-contributors-card";
import MobileQuestionFilter from "../mobile-question-filter";
import QuestionSortByDropdown from "../question-sort-by-dropdown";
import QuestionCard from "../card/question-card";
import { useLoaderData } from "react-router";
import type { loader } from "../../route/forum.new";
import { ForumPageLayout } from "../forum-page-layout";
import ForumCommunityHeroCard from "./forum-community-hero-card";
import ForumSidebarSearch from "./forum-sidebar-search";

interface ForumContentNewProps {
  questions?: QuestionResponse[];
  categories: CategoriesPicker[];
  selectedCategory: CategoriesPicker;
  onCategorySelect: (category: CategoriesPicker) => void;
  activeTab: ForumQuestionTab;
  setActiveTab: (tab: ForumQuestionTab) => void;
  sortBy: QuestionSortBy;
  setSortBy: (sortBy: QuestionSortBy) => void;
  tags?: TrendingTagResponse[];
  selectedTagId?: string;
  onTagSelect?: (tag: TrendingTagResponse) => void;
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
  const sentinelRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const d = prefersReducedMotion ? 0 : 1;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && onLoadMore) {
          observer.unobserve(el);
          onLoadMore();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  const categoriesCard = (
    <ForumTopCategoriesCard
      categories={categories}
      selectedCategory={selectedCategory}
      onCategorySelect={onCategorySelect}
    />
  );

  const trendingCard = (
    <TrendingTopics
      tags={tags}
      selectedTagId={selectedTagId}
      onTagSelect={onTagSelect}
    />
  );

  return (
    <ForumPageLayout contentClassName="flex gap-6">
      {/* Left sidebar: search, categories, trending topics */}
      <aside className="hidden w-70 shrink-0 space-y-5 lg:block">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 * d, ease: "easeOut" }}
        >
          <ForumSidebarSearch />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 * d, delay: 0.1 * d, ease: "easeOut" }}
        >
          {categoriesCard}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 * d, delay: 0.2 * d, ease: "easeOut" }}
        >
          {trendingCard}
        </motion.div>
      </aside>

      {/* Center column: composer hero, filters, discussions */}
      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 * d, ease: "easeOut" }}
        >
          <ForumCommunityHeroCard />
        </motion.div>

        <div className="lg:hidden">
          <ForumSidebarSearch />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 * d, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex flex-wrap items-center gap-2">
            <div className="hidden flex-wrap items-center gap-2 sm:flex">
              {tabItems.map((tab) => {
                const isActive = activeTab === tab.value;
                return (
                  <button
                    key={`${tab.label}-${tab.value}`}
                    type="button"
                    onClick={() => setActiveTab(tab.value)}
                    className={`cursor-pointer rounded-full border px-6 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-[#2f6fe4] bg-[#eaf2ff] text-[#2f6fe4]"
                        : "border-[#e2e8f0] bg-white text-[#48566a] hover:bg-[#f1f5f9]"
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 * d, delay: 0.1 * d }}
          className="flex flex-col gap-5"
        >
          {isLoading && questions?.length === 0
            ? Array.from({ length: 4 }).map((_, index) => (
                <motion.div
                  key={`question-skeleton-${index}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35 * d,
                    delay: (0.1 + index * 0.06) * d,
                    ease: "easeOut",
                  }}
                >
                  <QuestionCardSkeleton />
                </motion.div>
              ))
            : questions?.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35 * d,
                    delay: (0.1 + index * 0.06) * d,
                    ease: "easeOut",
                  }}
                >
                  <QuestionCard
                    question={question}
                    userId={userId ?? undefined}
                    categories={categories}
                    index={index}
                  />
                </motion.div>
              ))}
        </motion.div>

        {hasMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 * d, delay: 0.3 * d }}
            className="flex justify-center pt-2"
          >
            {isLoading ? (
              <Button
                type="button"
                variant="outline"
                disabled
                className="h-10 rounded-xl border-[#dbe3ee] px-6"
              >
                Loading...
              </Button>
            ) : (
              <div ref={sentinelRef} className="h-10" />
            )}
          </motion.div>
        )}

        {/* Sidebar cards fall below the list on small screens */}
        <div className="space-y-5 lg:hidden">
          {userId && <YourActivitiesCard />}
          {categoriesCard}
          {trendingCard}
          <TopContributorsCard />
        </div>
      </div>

      {/* Right sidebar: my discussion, top contributors */}
      <aside className="hidden w-75 shrink-0 space-y-5 lg:block">
        {userId && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35 * d,
              delay: 0.15 * d,
              ease: "easeOut",
            }}
          >
            <YourActivitiesCard />
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 * d, delay: 0.25 * d, ease: "easeOut" }}
        >
          <TopContributorsCard />
        </motion.div>
      </aside>
    </ForumPageLayout>
  );
}
