import {
  BookOpen,
  CircleHelp,
  Cpu,
  Globe,
  HandHelping,
  Heart,
} from "lucide-react";
import { CategoryCard } from "~/components/category-card";
import type { VolunteerCategory } from "~/services/volunteer/types/category";

interface VolunteerCategoriesSectionProps {
  categories: VolunteerCategory[];
}

export function VolunteerCategoriesSection({
  categories,
}: VolunteerCategoriesSectionProps) {
  console.log(categories.map((v) => v.iconKey));

  return (
    <section className="w-full bg-gray-50 px-6 md:px-12 lg:px-[131.5px] py-8">
      <div className="mx-auto w-full max-w-294.25">
        <header className="mb-9">
          <h2 className="mb-1.75 text-[21px] font-semibold leading-7 tracking-[-0.88px] text-[#030213]">
            Browse by categories
          </h2>
          <p className="text-sm font-medium leading-5.25 text-[#99a1af]">
            Find roles that match your passion and skills.
          </p>
        </header>
        <div className="w-full flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-1 pb-1 md:grid md:grid-cols-3 md:gap-3.5 md:overflow-visible md:px-0 lg:grid-cols-4 xl:grid-cols-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="shrink-0 snap-start md:min-w-0 md:shrink md:w-full"
            >
              <CategoryCard
                icon={category.iconKey ?? ""}
                title={category.name ?? "Unknown"}
                roleCount={category.displayOrder ?? 0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
