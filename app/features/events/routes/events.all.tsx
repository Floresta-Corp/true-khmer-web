import { useLoaderData } from "react-router";
import { useState } from "react";
import type { Route } from "./+types/events.all";
import {
  EventCard,
  type EventData,
} from "~/features/events/components/event-card";
import {
  getEventList,
  getEventsByCategory,
  getEventCategories,
} from "~/features/events/lib/events.server";
import type { EventCategory } from "~/features/events/lib/event-types";
import { ChevronDown } from "lucide-react";
import { EventCategoryCarousel } from "~/features/events/components/event-category-carousel";

const PAGE_SIZE = 8;

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const url = new URL(request.url);
    const categoryId = url.searchParams.get("categoryId");

    const [events, categories] = await Promise.all([
      categoryId ? getEventsByCategory(categoryId) : getEventList(),
      getEventCategories(),
    ]);

    return { events, categories, activeCategoryId: categoryId, error: null };
  } catch (err) {
    console.error("All events loader error:", err);
    return {
      events: [] as EventData[],
      categories: [] as EventCategory[],
      activeCategoryId: null as string | null,
      error: "Failed to load events. Please check your connection.",
    };
  }
}

export function meta() {
  return [{ title: "All Events | True Khmer" }];
}

export default function AllEvents() {
  const { events, categories, activeCategoryId, error } =
    useLoaderData<typeof loader>();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleEvents = events.slice(0, visibleCount);
  const hasMore = visibleCount < events.length;

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            All events
          </h1>
        </div>

        {/* Event type carousel */}
        <div className="mb-8">
          <EventCategoryCarousel
            categories={categories}
            activeCategoryId={activeCategoryId}
          />
        </div>

        {/* Error state */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* Event grid - 4 columns on desktop like the screenshot */}
        {!error && visibleEvents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {visibleEvents.map((event: EventData) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!error && events.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No events found.</p>
            <p className="text-gray-400 text-sm mt-1">
              Try selecting a different event type.
            </p>
          </div>
        )}

        {/* Load more */}
        {!error && hasMore && (
          <div className="mt-8">
            <button
              type="button"
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="w-full py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:border-gray-300 transition-colors cursor-pointer"
    >
      {icon}
      <span>{label}</span>
      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
    </button>
  );
}
