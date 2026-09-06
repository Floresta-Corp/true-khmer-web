import {
  BookOpen,
  Briefcase,
  CircleDollarSign,
  ChevronsLeftRight,
  Globe,
  Heart,
  LineChart,
  Megaphone,
  Palette,
  Shapes,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import { cn } from "~/lib/utils";
import type { CourseCategory } from "~/features/education/types";

const ICONS: Record<string, LucideIcon> = {
  BookOpen,
  Briefcase,
  ChevronsLeftRight,
  CircleDollarSign,
  Globe,
  Heart,
  LineChart,
  Megaphone,
  Palette,
  Sprout,
};

function iconFor(category: CourseCategory): LucideIcon {
  return (
    ICONS[category.iconKey ?? ""] ??
    ICONS[category.slug ?? ""] ??
    ICONS[category.id] ??
    Shapes
  );
}

interface CourseCategoryRowProps {
  categories: CourseCategory[];
  activeCategoryId: string | null;
  onSelect: (categoryId: string | null) => void;
}

/** "Classes by category" — icon above label, spread evenly across the row. */
export function CourseCategoryRow({
  categories,
  activeCategoryId,
  onSelect,
}: CourseCategoryRowProps) {
  return (
    <section className="mb-12">
      <h2 className="mb-6 text-xl font-bold text-[#1A1A2E]">
        Classes by category
      </h2>

      {/* Equal-width columns, so the pitch stays uniform whatever the label
          length — the design spaces these on a fixed grid, not by content.
          Below `sm` the row scrolls horizontally and items size to content. */}
      <div
        className="flex items-start gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:grid sm:gap-6 [&::-webkit-scrollbar]:hidden"
        style={{
          gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))`,
        }}
      >
        {categories.map((category) => {
          const Icon = iconFor(category);
          const isActive = activeCategoryId === category.id;
          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(isActive ? null : category.id)}
              className={cn(
                "flex shrink-0 cursor-pointer flex-col items-center gap-4 rounded-xl px-3 py-4 transition-colors sm:w-full",
                isActive
                  ? "bg-[#D8E2F8] text-[#1C5DD4]"
                  : "text-[#8C8CA1] hover:bg-[#D8E2F8] hover:text-[#1C5DD4]",
              )}
            >
              <Icon className="size-5.5" strokeWidth={1.6} aria-hidden />
              <span className="text-[13px] whitespace-nowrap">
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
