import { useLoaderData, Link } from "react-router";
import { useState, useRef, useEffect, useMemo } from "react";
import type { Route } from "./+types/events";
import {
  EventCard,
  type EventData,
} from "~/features/events/components/event-card";
import { Footer } from "~/components/footer";
import {
  getEventList,
  getUpcomingEvents,
} from "~/features/events/lib/events.server";
import {
  Search,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Check,
  Plus,
  Users,
  Wrench,
  Palette,
  MessageCircle,
  Compass,
  ArrowRight,
} from "lucide-react";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const [events, upcomingEvents] = await Promise.all([
      getEventList(),
      getUpcomingEvents(),
    ]);

    return { events, upcomingEvents, error: null };
  } catch (err) {
    console.error("Loader fetch error:", err);
    return {
      events: [] as EventData[],
      upcomingEvents: [] as EventData[],
      error: "Failed to load events. Please check your connection.",
    };
  }
}

export function meta() {
  return [{ title: "Events | True Khmer" }];
}

// Category config for the "Browse by categories" section
const CATEGORY_CONFIG = [
  {
    label: "FESTIVAL",
    displayName: "Festival",
    icon: Users,
    color: "text-blue-600 bg-blue-50",
  },
  {
    label: "EXHIBITION",
    displayName: "Exhibition",
    icon: Palette,
    color: "text-teal-600 bg-teal-50",
  },
  {
    label: "CONCERT",
    displayName: "Concert",
    icon: MessageCircle,
    color: "text-pink-600 bg-pink-50",
  },
  {
    label: "WORKSHOP",
    displayName: "Workshop",
    icon: Wrench,
    color: "text-purple-600 bg-purple-50",
  },
  {
    label: "CONFERENCE",
    displayName: "Conference",
    icon: Compass,
    color: "text-indigo-600 bg-indigo-50",
  },
];

const LOCATIONS = ["Anywhere", "Physical", "Virtual"];

function LocationDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors whitespace-nowrap"
      >
        <span>{value}</span>
        {open ? (
          <ChevronUp className="w-3.5 h-3.5 shrink-0" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 shrink-0" />
        )}
      </button>

      {open && (
        <div className="absolute top-full mt-1 right-0 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 min-w-36 z-50">
          {LOCATIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-left hover:bg-gray-50 transition-colors"
            >
              <span
                className={`w-3.5 h-3.5 rounded flex items-center justify-center border shrink-0 ${
                  value === opt
                    ? "bg-blue-600 border-blue-600"
                    : "border-gray-300"
                }`}
              >
                {value === opt && (
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                )}
              </span>
              <span className={value === opt ? "font-semibold" : ""}>
                {opt}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Events() {
  const { events, upcomingEvents, error } = useLoaderData<typeof loader>();
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("Anywhere");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Compute category counts from all events
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const event of events) {
      const type = event.eventType || "Other";
      counts[type] = (counts[type] || 0) + 1;
    }
    return counts;
  }, [events]);

  // Filter logic for featured events
  const featuredEvents = events.filter((event) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      event.title?.toLowerCase().includes(q) ||
      event.venueName?.toLowerCase().includes(q) ||
      event.excerpt?.toLowerCase().includes(q);

    const matchesCategory =
      !activeCategory || event.eventType === activeCategory;

    const matchesLocation =
      locationFilter === "Anywhere" ||
      (locationFilter === "Virtual" && event.isOnline) ||
      (locationFilter === "Physical" && !event.isOnline);

    return matchesSearch && matchesCategory && matchesLocation;
  });

  // Filter upcoming events with the same search/filter logic
  const filteredUpcoming = upcomingEvents.filter((event) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      event.title?.toLowerCase().includes(q) ||
      event.venueName?.toLowerCase().includes(q) ||
      event.excerpt?.toLowerCase().includes(q);

    const matchesCategory =
      !activeCategory || event.eventType === activeCategory;

    const matchesLocation =
      locationFilter === "Anywhere" ||
      (locationFilter === "Virtual" && event.isOnline) ||
      (locationFilter === "Physical" && !event.isOnline);

    return matchesSearch && matchesCategory && matchesLocation;
  });

  const hasNoResults =
    featuredEvents.length === 0 && filteredUpcoming.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <section className="relative bg-linear-to-b from-[#e8ecf8] to-[#f0f2fa] pt-20 pb-14 px-6">
        {/* Decorative circles — clipped wrapper */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-0 top-0 w-80 h-80 rounded-full bg-[#d6daf0] opacity-50 -translate-x-1/3 -translate-y-1/4" />
          <div className="absolute right-0 bottom-0 w-96 h-96 rounded-full bg-[#c8cee8] opacity-40 translate-x-1/3 translate-y-1/4" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#174FB4] mb-3 tracking-tight">
            Explore. <span className="text-[#32A8FF]">Connect.</span> Organize.
          </h1>
          <p className="text-base text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
            Find events worth your time, or create one worth remembering.
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto flex items-center gap-2">
            <div className="flex-1 flex items-center bg-white rounded-full h-12 px-4 gap-2 shadow-sm border border-gray-100">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events by title, venue, or keyword..."
                className="flex-1 min-w-0 text-sm bg-transparent border-none outline-none placeholder:text-gray-400 text-gray-700"
              />
              <div className="w-px h-5 bg-gray-200 shrink-0" />
              <LocationDropdown
                value={locationFilter}
                onChange={setLocationFilter}
              />
            </div>
            <Link
              to="#"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full h-12 px-5 shadow-sm transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Organize an Event</span>
            </Link>
          </div>

          {/* Supported by */}
          <p className="mt-5 text-xs text-gray-400 flex items-center justify-center gap-1.5">
            Supported by{" "}
            <a
              href="https://plumpievents.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold underline underline-offset-2"
            >
              Plumpi Event Management
            </a>
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="flex items-center justify-center gap-2 text-red-500 bg-red-50 p-4 rounded-lg mt-8">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {/* Featured Events */}
        {!error && featuredEvents.length > 0 && (
          <section className="py-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Featured Events
              </h2>
              <button className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1 border border-gray-200 rounded-full px-4 py-1.5">
                View all
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* Browse by categories */}
        {!error && events.length > 0 && (
          <section className="pb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 italic">
                Browse by categories
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Explore events based on your interests and career goals.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {CATEGORY_CONFIG.map((cat) => {
                const count = categoryCounts[cat.label] || 0;
                const isActive = activeCategory === cat.label;
                return (
                  <button
                    key={cat.label}
                    onClick={() =>
                      setActiveCategory(isActive ? null : cat.label)
                    }
                    className={`flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:border-blue-200 hover:shadow-sm"
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isActive ? "bg-white/20" : cat.color
                      }`}
                    >
                      <cat.icon className="w-4 h-4" />
                    </span>
                    <div className="text-left">
                      <div className="font-semibold leading-tight">
                        {cat.displayName}
                      </div>
                      <div
                        className={`text-[11px] leading-tight ${isActive ? "text-blue-100" : "text-gray-400"}`}
                      >
                        {count} {count === 1 ? "event" : "events"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Upcoming Events */}
        {!error && filteredUpcoming.length > 0 && (
          <section className="pb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Upcoming Events
              </h2>
              <button className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1 border border-gray-200 rounded-full px-4 py-1.5">
                View all
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUpcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {!error && hasNoResults && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No events found.</p>
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
