import type { EventCategory } from "~/features/events/lib/events.server";

interface CategoryFilterProps {
  categories: EventCategory[];
  categoryCounts: Record<string, number>;
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export function CategoryFilter({
  categories,
  categoryCounts,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <section className="pb-8 md:pb-12 bg-blue-50 w-full">
      <div className="mx-4 sm:mx-8 md:mx-16 lg:mx-[131.5px] py-8 md:py-17.5">
        <div className="mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Browse by categories
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Explore events based on your interests and career goals.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-wrap gap-2 md:gap-3 lg:justify-between">
          {categories.map((cat) => {
            const count = categoryCounts[cat.slug] || 0;
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(isActive ? null : cat.slug)}
                className={`flex items-center gap-2 md:gap-2.5 rounded-full border px-3 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:border-blue-200 hover:shadow-sm"
                }`}
              >
                <span
                  className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: isActive
                      ? "rgba(255,255,255,0.2)"
                      : `${cat.color}20`,
                  }}
                >
                  <span className="text-sm md:text-base leading-none">
                    {cat.icon}
                  </span>
                </span>
                <div className="text-left min-w-0">
                  <div className="font-semibold leading-tight truncate">
                    {cat.name}
                  </div>
                  <div
                    className={`text-[10px] md:text-[11px] leading-tight ${isActive ? "text-blue-100" : "text-gray-400"}`}
                  >
                    {count} {count === 1 ? "event" : "events"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
