import { Link } from "react-router";
import type { EventCategory } from "~/features/events/lib/event-types";

interface EventCategoryFilterProps {
  categories: EventCategory[];
}

export function EventCategoryFilter({ categories }: EventCategoryFilterProps) {
  return (
    <section className="w-full">
      <div>
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
            Browse by categories
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Explore events based on your interests and career goals.
          </p>
        </div>
        <div
          className="-m-1 flex items-center justify-between overflow-x-auto p-1"
          style={{ scrollbarWidth: "none" }}
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/events/all?categoryId=${category.id}`}
              className="group flex shrink-0 items-center gap-3 border border-gray-200 bg-white px-4 py-1.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md md:px-5 md:py-2"
              style={{ borderRadius: "24px" }}
            >
              <span
                className="text-xl leading-none"
                style={{ color: category.color }}
              >
                {category.icon}
              </span>
              <div>
                <div className="text-sm leading-snug font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                  {category.name}
                </div>
                <div className="mt-0.5 text-xs text-gray-400">
                  {category.eventCount}{" "}
                  {category.eventCount === 1 ? "event" : "events"}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
