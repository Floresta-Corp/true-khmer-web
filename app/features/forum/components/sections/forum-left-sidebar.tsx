import { Hash } from "lucide-react";
import { Toggle } from "~/components/ui/toggle";
import type { CategoriesPicker, Tag } from "~/services/forum/forum-types";
import ForumTopCategoriesCard from "../card/forum-top-categories-card";

function TrendingTopics({
  tags,
  selectedTagId,
  onTagSelect,
}: {
  tags?: Tag[] | undefined;
  selectedTagId?: string;
  onTagSelect?: (tag: Tag) => void;
}) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-[#f1f5f9] rounded-2xl p-5 w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Hash className="w-6 h-6 text-[#344256]" />
        <h3 className="font-bold text-lg leading-6.75 text-[#344256]">
          Trending Topics
        </h3>
      </div>

      {/* Topics badges */}
      <div className="flex flex-wrap gap-1.75">
        {tags.map((tag) => (
          <Toggle
            key={tag.id}
            onClick={() => onTagSelect?.(tag)}
            className={`inline-flex cursor-pointer rounded-lg border px-2 py-1 text-xs font-medium transition-colors`}
            title={tag.name}
          >
            #{tag.name}
          </Toggle>
        ))}
      </div>
    </div>
  );
}

interface ForumLeftSidebarProps {
  categories?: CategoriesPicker[] | undefined;
  selectedCategory?: CategoriesPicker;
  onCategorySelect?: (category: CategoriesPicker) => void;
  tags?: Tag[] | undefined;
  selectedTagId?: string;
  onTagSelect?: (tag: Tag) => void;
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
    <div className="flex flex-col gap-5 max-w-sm">
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
