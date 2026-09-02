import { CategoryCard } from "~/components/category-card";
import { cn } from "~/lib/utils";
import type { VolunteerCategory } from "~/features/volunteer/types/category";

interface VolunteerCategoriesSectionProps {
  fullscreen?: boolean;
  className?: string;
  categories: VolunteerCategory[];
  onClickCategory?: (categoryId: string | undefined) => void;
  cardClassName?: string;
  activeCategoryId?: string;
  showAllCategory?: boolean;
}

export function VolunteerCategoriesSection({
  categories,
  onClickCategory,
  className,
  cardClassName,
  fullscreen,
  activeCategoryId,
  showAllCategory,
}: VolunteerCategoriesSectionProps) {
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
        {/* <header className="mb-9">
          <h2 className="mb-1.75 text-[21px] leading-7 font-semibold tracking-[-0.88px] text-[#030213]">
            Browse by categories
          </h2>
          <p className="text-sm leading-5.25 font-medium text-[#99a1af]">
            Find roles that match your passion and skills.
          </p>
        </header> */}
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
          {categories.map((category) => (
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
