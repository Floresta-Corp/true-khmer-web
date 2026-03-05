import {
  BookOpen,
  CircleHelp,
  Cpu,
  Globe,
  HandHelping,
  Heart,
} from "lucide-react";
import { CategoryCard } from "./CategoryCard";

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
  {
    icon: <CircleHelp className="size-[17.5px]" strokeWidth={2} />,
    title: "Arts & culture",
    roleCount: 6,
  },
];

export function BrowseCategories() {
  return (
    <section className="w-full bg-gray-50 px-6 py-16 md:px-12 lg:px-[131.5px] lg:py-[70px]">
      <div className="mx-auto w-full max-w-[1177px]">
        <header className="mb-9">
          <h2 className="mb-[7px] text-[21px] font-semibold leading-7 tracking-[-0.88px] text-[#030213]">
            Browse by categories
          </h2>
          <p className="text-sm font-medium leading-[21px] text-[#99a1af]">
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
                icon={category.icon}
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
