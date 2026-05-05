import ForumLeftSidebar from "./forum-left-sidebar";
import {
  DiscussionThreadSection,
  type DiscussionThreadSectionTab,
} from "./discusssion-thread-section";
import ForumRightSidebar from "./forum-right-sidebar";
import type {
  CategoriesPicker,
  Question,
  Tag,
} from "~/services/forum/forum-types";
import type { AuthenticatedUser } from "~/lib/server/types";

interface ForumContentProps {
  data?: {
    questions: Question[] | undefined;
    hasMore: boolean | undefined;
  };
  categories: CategoriesPicker[] | undefined;
  tags: Tag[] | undefined;
  onLoadMore?: () => void;
  isLoading?: boolean;
  selectedCategory: CategoriesPicker;
  setSelectedCategory: (category: CategoriesPicker) => void;
  selectedTagId?: string;
  setSelectedTagId: (tagId: string | undefined) => void;
  activeTab: DiscussionThreadSectionTab;
  setActiveTab: (tab: DiscussionThreadSectionTab) => void;
}

export default function ForumContent({
  data,
  categories,
  onLoadMore,
  isLoading,
  tags,
  selectedCategory,
  setSelectedCategory,
  selectedTagId,
  setSelectedTagId,
  activeTab,
  setActiveTab,
}: ForumContentProps) {
  return (
    <div className="bg-[#F8FAFC] px-4 sm:px-8 lg:px-16 xl:px-30 py-6 sm:py-8 lg:py-10 min-h-screen">
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

      <div className="flex gap-7 mx-auto px-4 lg:px-8 justify-center items-start w-full">
        {/* Left Sidebar — hidden on mobile/tablet */}
        <div className="hidden lg:block w-56 xl:w-64 shrink-0">
          <ForumLeftSidebar
            tags={tags}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            selectedTagId={selectedTagId}
            onTagSelect={(tag) =>
              setSelectedTagId(selectedTagId === tag.id ? undefined : tag.id)
            }
          />
        </div>

        {/* Main Content */}
        <div className="lg:max-w-134">
          <DiscussionThreadSection
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
        <div className="hidden lg:block w-56 lg:w-64">
          <ForumRightSidebar />
        </div>
      </div>
    </div>
  );
}
