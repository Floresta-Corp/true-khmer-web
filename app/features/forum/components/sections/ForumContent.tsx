import { useState } from "react";
import ForumSidebar from "../ForumSidebar";
import { DiscussionThread } from "../DiscussionThread";
import RightSidebar from "../RightSidebar";
import type { CategoriesPicker, Question } from "~/services/forum/types";
import type { AuthenticatedUser } from "~/lib/server/route-guards.server";

interface ForumContentProps {
  user: AuthenticatedUser;
  data?: {
    questions: Question[] | undefined;
    hasMore: boolean | undefined;
  };
  categories: CategoriesPicker[] | undefined;
  onLoadMore?: () => void;
  isLoading?: boolean;
  selectedCategory: CategoriesPicker;
  setSelectedCategory: (category: CategoriesPicker) => void;
}

export default function ForumContent({
  user,
  data,
  categories,
  onLoadMore,
  isLoading,
  selectedCategory,
  setSelectedCategory,
}: ForumContentProps) {
  const [activeTab, setActiveTab] = useState<
    "recent" | "topRated" | "unanswered" | "myActivity"
  >("recent");

  return (
    <div className="bg-[#f8fafc] px-4 sm:px-8 lg:px-16 xl:px-30 py-6 sm:py-8 lg:py-10 min-h-screen">
      {/* Mobile: categories as horizontal scrollable chips */}
      <div className="flex lg:hidden gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
        {categories &&
          categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                selectedCategory === cat
                  ? "bg-[#2f6fe4] text-white border-[#2f6fe4]"
                  : "bg-white text-[#4a5565] border-[#e2e8f0] hover:bg-[#f0f6ff] hover:text-[#2f6fe4]"
              }`}
            >
              {cat.name}
            </button>
          ))}
      </div>

      <div className="flex gap-7 max-w-full">
        {/* Left Sidebar — hidden on mobile/tablet */}
        <div className="hidden lg:block w-56 xl:w-64 shrink-0">
          <ForumSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <DiscussionThread
            user={user}
            categories={categories}
            data={data}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onCategoryClick={setSelectedCategory}
            onLoadMore={onLoadMore}
            isLoading={isLoading}
          />
        </div>

        {/* Right Sidebar — hidden on mobile */}
        <div className="hidden xl:block w-56 xl:w-64 shrink-0">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
