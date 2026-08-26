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
import { Button } from "~/components/ui/button";
import { ChevronDown } from "lucide-react";
import { EventCategoryCarousel } from "~/features/events/components/event-category-carousel";

const PAGE_SIZE = 8;

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const url = new URL(request.url);
    const categoryId = url.searchParams.get("categoryId");

    // Fetch categories first so we can validate categoryId against them
    const categories = await getEventCategories();

    // Only use categoryId if it matches a known category; fall back to all events otherwise
    const validCategoryId =
      categoryId && categories.some((c) => c.id === categoryId)
        ? categoryId
        : null;

    const events = validCategoryId
      ? await getEventsByCategory(validCategoryId)
      : await getEventList();

    return {
      events,
      categories,
      activeCategoryId: validCategoryId,
      error: null,
    };
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
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        {/* Header row */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
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
          <div className="py-12 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* Event grid - 4 columns on desktop like the screenshot */}
        {!error && visibleEvents.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleEvents.map((event: EventData) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!error && events.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg text-gray-400">No events found.</p>
            <p className="mt-1 text-sm text-gray-400">
              Try selecting a different event type.
            </p>
          </div>
        )}

        {/* Load more */}
        {!error && hasMore && (
          <div className="mt-8">
            <Button
              type="button"
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              variant="ghost"
              className="h-auto w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-0 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Load more
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Button
      type="button"
      variant="ghost"
      className="flex h-auto cursor-pointer items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300"
    >
      {icon}
      <span>{label}</span>
      <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
    </Button>
  );
}
