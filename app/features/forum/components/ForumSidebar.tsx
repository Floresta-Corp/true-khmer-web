import { Hash } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { CategoriesPicker } from "~/services/forum/types";

export const TRENDING_TOPICS = [
  "#ImpactKhmerLaunchpad",
  "#RealEstateTrendsPP",
  "#VCFundinginSEA",
  "#Agri-TechOpportunities",
  "#DigitalNomadLife",
];

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
            const count = Math.floor(Math.random() * 11);
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

function TrendingTopics() {
  return (
    <div className="bg-white border border-[#f1f5f9] rounded-2xl p-5 w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Hash className="w-6 h-6 text-[#344256]" />
        <h3 className="font-bold text-lg leading-6.75 text-[#344256]">
          Trending Topics
        </h3>
      </div>

      {/* Topics grid */}
      <div className="flex flex-col gap-1.75">
        {TRENDING_TOPICS.map((topic, index) => (
          <div
            key={index}
            className={`flex gap-1.75 flex-wrap ${index % 2 === 0 ? "" : ""}`}
          >
            <Button
              variant="ghost"
              className="bg-[#f8fafc] rounded-2xl px-1.5 py-1 hover:bg-[#f1f5f9] transition-colors"
              title={topic}
            >
              <span className="text-xs font-medium text-[#344256]">
                {topic}
              </span>
            </Button>
            {index < TRENDING_TOPICS.length - 1 &&
              (index + 1) % 2 === 0 &&
              TRENDING_TOPICS[index + 1] && (
                <Button
                  variant="ghost"
                  className="bg-[#f8fafc] rounded-2xl px-1.5 py-1 hover:bg-[#f1f5f9] transition-colors"
                  title={TRENDING_TOPICS[index + 1]}
                >
                  <span className="text-xs font-medium text-[#344256]">
                    {TRENDING_TOPICS[index + 1]}
                  </span>
                </Button>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface ForumSidebarProps {
  categories?: CategoriesPicker[] | undefined;
  selectedCategory?: CategoriesPicker;
  onCategorySelect?: (category: CategoriesPicker) => void;
}

export default function ForumSidebar({
  selectedCategory,
  categories,
  onCategorySelect,
}: ForumSidebarProps) {
  return (
    <div className="flex flex-col gap-5 max-w-sm">
      <Categories
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={onCategorySelect}
      />
      <TrendingTopics />
    </div>
  );
}
