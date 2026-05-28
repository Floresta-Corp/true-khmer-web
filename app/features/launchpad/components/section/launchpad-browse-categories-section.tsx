import { CategoryCard } from "~/components/category-card";
import { useLoaderData, useNavigate } from "react-router";
import type { loader } from "~/features/launchpad/routes/launchpad";
import type { Category } from "~/services/launchpad/types/category";

export function LaunchpadBrowseCategoriesSection() {
  const { categories } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <section className="w-full px-6 md:px-12 lg:px-[131.5px] py-8 lg:py-21">
      <div className="mx-auto w-full max-w-300">
        <header className="mb-9">
          <h2 className="mb-1.75 text-[21px] font-semibold leading-7 tracking-[-0.88px] text-[#030213]">
            Browse by categories
          </h2>
          <p className="text-sm font-medium leading-5.25 text-[#99a1af]">
            Find roles that match your passion and skills.
          </p>
        </header>
        <div className="w-full flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-1 pb-1 md:grid md:grid-cols-3 md:gap-3.5 md:overflow-visible md:px-0 lg:grid-cols-4 xl:grid-cols-6">
          {categories.map((category: Category) => {
            return (
              <div
                key={category.id}
                className="shrink-0 snap-start md:min-w-0 md:shrink md:w-full cursor-pointer"
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
