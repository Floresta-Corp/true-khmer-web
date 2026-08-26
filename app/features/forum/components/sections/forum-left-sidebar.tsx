import type { TrendingTagResponse } from "~/types/api-client";
import type { CategoriesPicker } from "~/features/forum/types";
import ForumTopCategoriesCard from "../card/forum-top-categories-card";
import TrendingTopics from "./trending-topics";

interface ForumLeftSidebarProps {
  categories?: CategoriesPicker[] | undefined;
  selectedCategory?: CategoriesPicker;
  onCategorySelect?: (category: CategoriesPicker) => void;
  tags?: TrendingTagResponse[] | undefined;
  selectedTagId?: string;
  onTagSelect?: (tag: TrendingTagResponse) => void;
}

export default function ForumLeftSidebar({
  selectedCategory,
  categories,
  tags,
  onCategorySelect,
  selectedTagId,
  onTagSelect,
}: ForumLeftSidebarProps) {
  return (
    <div className="flex max-w-sm flex-col gap-5">
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
    </div>
  );
}
