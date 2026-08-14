import { CategoryCard } from "~/components/category-card";
import { useLoaderData, useNavigate } from "react-router";
import type { loader } from "~/features/launchpad/route/launchpad";
import type { Category } from "~/features/launchpad/types";

export function LaunchpadBrowseCategoriesSection() {
  const { categories } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <section className="w-full py-8 lg:py-21">
      <div className="site-container">
        <header className="mb-9">
          <h2 className="mb-1.75 text-[21px] leading-7 font-semibold tracking-[-0.88px] text-[#030213]">
            Browse by categories
          </h2>
          <p className="text-sm leading-5.25 font-medium text-[#99a1af]">
            Find roles that match your passion and skills.
          </p>
        </header>
        <div className="flex w-full snap-x snap-mandatory gap-3.5 overflow-x-auto px-1 pb-1 md:grid md:grid-cols-3 md:gap-3.5 md:overflow-visible md:px-0 lg:grid-cols-4 xl:grid-cols-6">
          {categories.map((category: Category) => {
            return (
              <div
                key={category.id}
                className="shrink-0 cursor-pointer snap-start md:w-full md:min-w-0 md:shrink"
                onClick={() =>
                  navigate(`/launchpad/all?categoryId=${category.id}`)
                }
              >
                <CategoryCard
                  category={{
                    ...category,
                    displayOrder: category.totalLaunchpad,
                    updatedBy: category.updatedBy ?? undefined,
                  }}
                  displayName="projects"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
