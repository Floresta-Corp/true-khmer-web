import { Hash } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import type { CategoriesPicker, Tag } from "~/services/forum/types";

interface CategoriesProps {
  categories?: CategoriesPicker[] | undefined;
  selectedCategory?: CategoriesPicker;
  onCategorySelect?: (category: CategoriesPicker) => void;
}

function Categories({
  categories,
  selectedCategory = { id: "all-categories", name: "All Categories" },
  onCategorySelect,
}: CategoriesProps) {
  return (
    <div className="bg-white border border-[#f1f5f9] rounded-2xl p-5 w-full">
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-bold text-lg leading-6.75 text-[#344256]">
          Categories
        </h3>
      </div>

      {/* Category buttons */}
      <div className="flex flex-col gap-[3.5px]">
        {categories &&
          categories.map((category) => {
            const count = category.count ?? 0; // Fallback to 0 if count is undefined
            return (
              <Button
                key={category.name}
                onClick={() => onCategorySelect?.(category)}
                variant="ghost"
                className={`flex h-9 items-center justify-between px-2.25 py-0 rounded-lg transition-colors ${
                  selectedCategory.id === category.id
                    ? "bg-transparent"
                    : "hover:bg-[#f8fafc]"
                }`}
              >
                <span
                  className={`text-sm font-semibold text-center tracking-tight ${
                    selectedCategory.id === category.id
                      ? "text-[#2f6fe4]"
                      : "text-[#4a5565]"
                  }`}
                >
                  {category.name}
                </span>
                <span
                  className={`h-[18.5px] rounded-lg px-1.5 text-xs font-semibold text-center flex items-center justify-center ${
                    selectedCategory.id === category.id
                      ? "bg-[#2f6fe4] text-white"
                      : "bg-[#f3f4f6] text-[#99a1af]"
                  }`}
                >
                  {count}
                </span>
              </Button>
            );
          })}
      </div>
    </div>
  );
}

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
          <Badge
            key={tag.id}
            onClick={() => onTagSelect?.(tag)}
            className={`inline-flex cursor-pointer rounded-lg border px-2 py-1 text-xs font-medium transition-colors ${
              selectedTagId === tag.id
                ? "border-[#c9defc] bg-[#edf4ff] text-[#1f5fbf] hover:bg-[#e2eeff]"
                : "border-[#e6ebf1] bg-[#f6f8fb] text-[#4a5565] hover:bg-[#eef2f7] hover:text-[#344256]"
            }`}
            title={tag.name}
          >
            #{tag.name}
          </Badge>
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
      <Categories
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
