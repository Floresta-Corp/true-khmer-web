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
    <Card className="w-full rounded-2xl border-none bg-white p-5 shadow-none">
      <div className="mb-4">
        <h3 className="text-lg leading-6.75 font-bold text-[#344256]">
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
              className={`flex h-9 items-center justify-between rounded-lg px-2.25 py-0 transition-colors ${
                selectedCategory.id === category.id
                  ? "bg-transparent"
                  : "hover:bg-[#f8fafc]"
              }`}
            >
              <span
                className={`text-center text-sm font-semibold tracking-tight ${
                  selectedCategory.id === category.id
                    ? "text-[#2f6fe4]"
                    : "text-[#4a5565]"
                }`}
              >
                {category.name}
              </span>
              <span
                className={`flex h-[18.5px] items-center justify-center rounded-lg px-1.5 text-center text-xs font-semibold ${
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
