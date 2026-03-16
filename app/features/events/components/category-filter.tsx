import { Link } from "react-router";
import { EVENT_TYPES, type EventType } from "~/features/events/lib/event-types";
import { formatEventType } from "~/features/events/lib/event-formatters";

const EVENT_TYPE_META: Record<EventType, { icon: string; color: string }> = {
  CONFERENCE: { icon: "🎤", color: "#4F46E5" },
  WORKSHOP: { icon: "🛠️", color: "#9333EA" },
  SEMINAR: { icon: "📚", color: "#2563EB" },
  CONCERT: { icon: "🎵", color: "#DB2777" },
  FESTIVAL: { icon: "🎉", color: "#D97706" },
  EXHIBITION: { icon: "🖼️", color: "#0D9488" },
  NETWORKING: { icon: "🤝", color: "#2563EB" },
  TRAINING: { icon: "🏋️", color: "#16A34A" },
  WEBINAR: { icon: "💻", color: "#0891B2" },
  OTHER: { icon: "📌", color: "#6B7280" },
};

export function EventTypeFilter() {
  return (
    <section className="pb-8 md:pb-12 bg-blue-50 w-full">
      <div className="mx-4 sm:mx-8 md:mx-16 lg:mx-[131.5px] py-8 md:py-17.5">
        <div className="mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Browse by Event Type
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Explore events based on your interests and career goals.
          </p>
        </div>
        <div className="flex justify-between gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {EVENT_TYPES.map((type) => {
            const meta = EVENT_TYPE_META[type];
            return (
              <Link
                key={type}
                to={`/events/all?eventType=${type}`}
                className="flex items-center gap-2 md:gap-2.5 rounded-full border px-3 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer bg-white text-gray-700 border-gray-200 hover:border-blue-200 hover:shadow-sm"
              >
                <span
                  className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${meta.color}20` }}
                >
                  <span className="text-sm md:text-base leading-none">
                    {meta.icon}
                  </span>
                </span>
                <div className="text-left">
                  <div className="font-semibold leading-tight">
                    {formatEventType(type)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
