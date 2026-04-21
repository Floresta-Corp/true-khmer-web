import { BookOpen, Cpu, Globe, HandHelping, Heart } from "lucide-react";
import { CategoryCard } from "~/components/category-card";

const categories = [
  {
    icon: <BookOpen className="size-[17.5px]" strokeWidth={2} />,
    title: "Education",
    roleCount: 12,
  },
  {
    icon: <Globe className="size-[17.5px]" strokeWidth={2} />,
    title: "Environment",
    roleCount: 8,
  },
  {
    icon: <Heart className="size-[17.5px]" strokeWidth={2} />,
    title: "Health",
    roleCount: 5,
  },
  {
    icon: <HandHelping className="size-[17.5px]" strokeWidth={2} />,
    title: "Mentorship",
    roleCount: 15,
  },
  {
    icon: <Cpu className="size-[17.5px]" strokeWidth={2} />,
    title: "Technology",
    roleCount: 10,
  },
];

export function LaunchpadBrowseCategoriesSection() {
  return (
    <section className="w-full px-6 md:px-12 lg:px-[131.5px] py-8 lg:py-21">
      <div className="mx-auto w-full max-w-304">
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
              key={category.title}
              className="shrink-0 snap-start md:min-w-0 md:shrink md:w-full"
            >
              <CategoryCard
                icon={category.icon ?? ""}
                title={category.title}
                roleCount={category.roleCount}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
