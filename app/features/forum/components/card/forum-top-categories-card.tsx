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
    <Card className="bg-white border shadow-none rounded-2xl p-5 w-full">
      <div className="mb-4">
        <h3 className="font-bold text-lg leading-6.75 text-[#344256]">
          Categories
        </h3>
      </div>

      <div className="flex flex-col gap-[3.5px]">
        {categories?.map((category) => {
          const count = category.count ?? 0;

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
    </Card>
  );
}
