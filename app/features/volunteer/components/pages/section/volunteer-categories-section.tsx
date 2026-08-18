import { CategoryCard } from "~/components/category-card";
import { cn } from "~/lib/utils";
import type { VolunteerCategory } from "~/features/volunteer/types/category";

interface VolunteerCategoriesSectionProps {
  fullscreen?: boolean;
  className?: string;
  categories: VolunteerCategory[];
  onClickCategory?: (categoryId: string) => void;
  cardClassName?: string;
  activeCategoryId?: string;
}

export function VolunteerCategoriesSection({
  categories,
  onClickCategory,
  className,
  cardClassName,
  fullscreen,
  activeCategoryId,
}: VolunteerCategoriesSectionProps) {
  return (
    <section
      className={cn("w-full bg-gray-50", fullscreen ? "" : "py-8", className)}
    >
      <div className={cn(fullscreen ? "w-full" : "site-container")}>
        <header className="mb-9">
          <h2 className="mb-1.75 text-[21px] leading-7 font-semibold tracking-[-0.88px] text-[#030213]">
            Browse by categories
          </h2>
          <p className="text-sm leading-5.25 font-medium text-[#99a1af]">
            Find roles that match your passion and skills.
          </p>
        </header>
        <div className="flex w-full snap-x snap-mandatory gap-3.5 overflow-x-auto px-1 pb-1 md:grid md:grid-cols-3 md:gap-3.5 md:overflow-visible md:px-0 lg:grid-cols-4 xl:grid-cols-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="shrink-0 snap-start md:w-full md:min-w-0 md:shrink"
            >
              <CategoryCard
                onClick={() => onClickCategory?.(category.id)}
                className={cardClassName}
                active={category.id === activeCategoryId}
                category={{
                  ...category,
                  displayOrder: category.opportunityCount,
                  updatedBy: category.updatedBy ?? undefined,
                }}
                displayName={
                  (category?.opportunityCount || 0) > 1 ? "listings" : "listing"
                }
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
