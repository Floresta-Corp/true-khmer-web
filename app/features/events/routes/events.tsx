import { useLoaderData, Link } from "react-router";
import { useState, useMemo, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Route } from "./+types/events";
import {
  EventCard,
  type EventData,
} from "~/features/events/components/event-card";
import {
  getEventList,
  getUpcomingEvents,
  getEventCategories,
} from "~/features/events/lib/events.server";
import { AlertCircle } from "lucide-react";
import { EventHero } from "~/features/events/components/event-hero";
import { EventCategoryFilter } from "~/features/events/components/category-filter";
import { debounce } from "~/lib/utils";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const [events, upcomingEvents, categories] = await Promise.all([
      getEventList(),
      getUpcomingEvents(),
      getEventCategories(),
    ]);

    return { events, upcomingEvents, categories, error: null };
  } catch (err) {
    console.error("Loader fetch error:", err);
    return {
      events: [] as EventData[],
      upcomingEvents: [] as EventData[],
      categories: [],
      error: "Failed to load events. Please check your connection.",
    };
  }
}

export function meta() {
  return [{ title: "Events | True Khmer" }];
}

export default function Events() {
  const { events, upcomingEvents, categories, error } =
    useLoaderData<typeof loader>();
  const prefersReducedMotion = useReducedMotion();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("Anywhere");

  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => setSearch(value), 300),
    [],
  );

  useEffect(() => {
    debouncedSetSearch(searchInput);
  }, [searchInput, debouncedSetSearch]);

  useEffect(() => {
    return () => debouncedSetSearch.cancel();
  }, [debouncedSetSearch]);

  // Compute unique locations from event data
  const locationOptions = useMemo(() => {
    const venueNames = new Set<string>();
    for (const event of [...events, ...upcomingEvents]) {
      if (event.venueName) {
        venueNames.add(event.venueName);
      }
    }
    return ["Anywhere", ...Array.from(venueNames).sort()];
  }, [events, upcomingEvents]);

  // Filter logic for events (search + location only, eventType is handled server-side)
  const filteredEvents = events.filter((event: EventData) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      event.title?.toLowerCase().includes(q) ||
      event.venueName?.toLowerCase().includes(q) ||
      event.excerpt?.toLowerCase().includes(q);

    const matchesLocation =
      locationFilter === "Anywhere" || event.venueName === locationFilter;

    return matchesSearch && matchesLocation;
  });

  // Filter upcoming events with the same search/location logic
  const filteredUpcoming = upcomingEvents.filter((event: EventData) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      event.title?.toLowerCase().includes(q) ||
      event.venueName?.toLowerCase().includes(q) ||
      event.excerpt?.toLowerCase().includes(q);

    const matchesLocation =
      locationFilter === "Anywhere" || event.venueName === locationFilter;

    return matchesSearch && matchesLocation;
  });

  const hasNoResults =
    filteredEvents.length === 0 && filteredUpcoming.length === 0;
  const duration = prefersReducedMotion ? 0 : 0.35;

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: 0 }}
      >
        <EventHero
          search={searchInput}
          onSearchChange={setSearchInput}
          locationFilter={locationFilter}
          onLocationChange={setLocationFilter}
          locationOptions={locationOptions}
        />
      </motion.div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, delay: prefersReducedMotion ? 0 : 0.08 }}
        >
          {error && (
            <div className="mx-4 mt-4 flex items-center justify-center gap-2 rounded-lg bg-red-50 p-3 text-red-500 sm:mx-8 md:mx-16 md:mt-8 md:p-4 lg:mx-28.25">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm md:text-base">{error}</p>
            </div>
          )}

          {/* Browse by Event Category */}
          {!error && (
            <div className="pt-17.5 pb-3.5">
              <EventCategoryFilter categories={categories} />
            </div>
          )}
        </motion.div>

        {/* All Event */}
        {!error && filteredEvents.length > 0 && (
          <motion.section
            className="py-8 md:py-12"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, delay: prefersReducedMotion ? 0 : 0.16 }}
          >
            <div className="flex items-center justify-between pb-8 md:mb-6">
              <h2 className="text-2xl font-bold text-gray-900 md:text-4xl">
                Events
              </h2>
              <Link
                to="/events/all"
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-500 transition-colors hover:text-blue-600 md:px-4 md:py-1.5 md:text-sm"
              >
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
              {filteredEvents.slice(0, 6).map((event: EventData) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Empty state */}
        {!error && hasNoResults && (
          <motion.div
            className="px-4 py-12 text-center md:py-20"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, delay: prefersReducedMotion ? 0 : 0.16 }}
          >
            <p className="text-base text-gray-400 md:text-lg">
              No events found.
            </p>
            <p className="mt-1 text-xs text-gray-400 md:text-sm">
              Try adjusting your search or filters.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
