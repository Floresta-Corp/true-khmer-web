import { Link } from "react-router";
import type { EventCategory } from "~/features/events/lib/event-types";

interface EventCategoryFilterProps {
  categories: EventCategory[];
}

export function EventCategoryFilter({ categories }: EventCategoryFilterProps) {
  return (
    <section className="w-full">
      <div className="mx-4 sm:mx-8 md:mx-16 lg:mx-[131.5px] py-8">
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Browse by categories
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Explore events based on your interests and career goals.
          </p>
        </div>
        <div
          className="flex gap-3 md:gap-4 overflow-x-auto p-1 -m-1"
          style={{ scrollbarWidth: "none" }}
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/events/all?categoryId=${category.id}`}
              className="group flex items-center gap-3 border border-gray-200 bg-white px-4 md:px-5 py-1.5 md:py-2 transition-all hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 shrink-0 shadow-sm"
              style={{ borderRadius: "24px" }}
            >
              <span
                className="text-xl leading-none"
                style={{ color: category.color }}
              >
                {category.icon}
              </span>
              <div>
                <div className="font-semibold text-sm text-gray-900 leading-snug group-hover:text-blue-600 transition-colors">
                  {category.name}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
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
