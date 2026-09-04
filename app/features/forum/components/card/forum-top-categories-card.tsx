import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import type { CategoriesPicker } from "~/features/forum/types";

export interface ForumTopCategoriesCardProps {
  categories?: CategoriesPicker[];
  selectedCategory?: CategoriesPicker;
  onCategorySelect?: (category: CategoriesPicker) => void;
}

export default function ForumTopCategoriesCard({
  categories,
  selectedCategory = { id: "all-categories", name: "All Categories" },
  onCategorySelect,
}: ForumTopCategoriesCardProps) {
  return (
    <Card className="w-full gap-0 rounded-2xl border border-[#e9eef5] bg-white p-5 shadow-none">
      <div className="mb-3">
        <h3 className="text-base leading-6 font-bold text-[#0f1729]">
          Categories
        </h3>
      </div>

      <div className="flex flex-col gap-0.5">
        {categories?.map((category) => {
          const count = category.count ?? 0;
          const isSelected = selectedCategory.id === category.id;

          return (
            <Button
              key={category.name}
              onClick={() => onCategorySelect?.(category)}
              variant="ghost"
              className="flex h-9 items-center justify-between rounded-lg px-2.25 py-0 transition-colors hover:bg-[#f8fafc]"
            >
              <span
                className={`truncate text-left text-sm font-medium tracking-tight ${
                  isSelected ? "text-[#2f6fe4]" : "text-[#4a5565]"
                }`}
              >
                {category.name}
              </span>
              <span
                className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-center text-xs font-semibold ${
                  isSelected
                    ? "bg-[#2f6fe4] text-white"
                    : "bg-transparent text-[#9eacc0]"
                }`}
              >
                {count}
              </span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
}
