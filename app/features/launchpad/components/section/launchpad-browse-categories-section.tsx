import { CategoryCard } from "~/components/category-card";
import type { Category } from "~/features/launchpad/types";
import { cn } from "~/lib/utils";

interface LaunchpadCategoriesSectionProps {
  fullscreen?: boolean;
  className?: string;
  categories: Category[];
  onClickCategory?: (categoryId: string | undefined) => void;
  cardClassName?: string;
  activeCategoryId?: string;
  showAllCategory?: boolean;
}

export function LaunchpadBrowseCategoriesSection({
  categories,
  onClickCategory,
  className,
  cardClassName,
  fullscreen,
  activeCategoryId,
  showAllCategory,
}: LaunchpadCategoriesSectionProps) {
  const cardClassNames = cn(
    "h-10 w-auto gap-2 rounded-full px-4 sm:h-11 sm:gap-2.5 sm:px-5 md:w-auto",
    cardClassName,
  );

  return (
    <section
      className={cn(
        "w-full bg-white",
        fullscreen ? "" : "py-6 md:py-8",
        className,
      )}
    >
      <div className={cn(fullscreen ? "w-full" : "site-container")}>
        <div className="-mx-4 no-scrollbar flex w-auto snap-x snap-mandatory scroll-pl-4 gap-2 overflow-x-auto px-4 pb-1 sm:gap-3 md:mx-0 md:w-full md:flex-wrap md:gap-y-3 md:overflow-visible md:px-0">
          {showAllCategory ? (
            <div className="shrink-0 snap-start">
              <CategoryCard
                onClick={() => onClickCategory?.(undefined)}
                className={cardClassNames}
                active={!activeCategoryId}
                category={{ id: "", name: "All", iconKey: "LayoutGrid" }}
              />
            </div>
          ) : null}
          {categories.map((category: Category) => (
            <div key={category.id} className="shrink-0 snap-start">
              <CategoryCard
                onClick={() => onClickCategory?.(category.id)}
                className={cardClassNames}
                active={category.id === activeCategoryId}
                category={{
                  ...category,
                  updatedBy: category.updatedBy ?? undefined,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
