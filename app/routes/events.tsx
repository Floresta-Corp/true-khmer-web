import { useState } from "react";
import type { Route } from "./+types/events";
import { useLoaderData, Link } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  CalendarDays,
  Search,
  MapPin,
  Heart,
  ArrowRight,
  LayoutGrid,
  List,
  Ticket,
  ChevronDown,
  Globe,
  AlertTriangle,
} from "lucide-react";
import { resolveApiBase } from "~/lib/server/api-base.server";

interface EventItem {
  title: string;
  slug: string;
  startDate: string;
  endDate: string;
  venueId: string | null;
  cover: string;
  excerpt: string;
  city: string | null;
  ticketStatus: string;
  isOnline: boolean;
  basePrice: string;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Events - True Khmer" },
    {
      name: "description",
      content: "Discover events and community gatherings",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const apiBase = resolveApiBase(request);

  let events: EventItem[] = [];
  let error: string | null = null;
  try {
    const res = await fetch(`${apiBase}/event`);
    if (res.ok) {
      const json = await res.json();
      events = json.data ?? [];
    } else {
      error = `Failed to load events (status ${res.status})`;
    }
  } catch (e) {
    error = "Unable to connect to the event service. Please try again later.";
    console.error("Event API error:", e);
  }

  return { events, error };
}

function formatEventDate(dateStr: string) {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };
  const formatted = date
    .toLocaleDateString("en-US", options)
    .toUpperCase()
    .replace(",", "");

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "shortOffset",
  });

  return `${formatted} • ${timeStr}`;
}

function getCategoryLabel(event: EventItem): string {
  if (event.isOnline) return "ONLINE";
  if (parseFloat(event.basePrice) === 0) return "LEARNING";
  return "CULTURAL";
}

function getCategoryColor(label: string): string {
  switch (label) {
    case "LEARNING":
      return "bg-emerald-500 text-white";
    case "CULTURAL":
      return "bg-orange-500 text-white";
    case "NETWORKING":
      return "bg-violet-500 text-white";
    case "ONLINE":
      return "bg-blue-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
}

function formatPrice(price: string): string {
  const num = parseFloat(price);
  if (num === 0) return "Free";
  return `$${num.toFixed(0)}`;
}

function getTicketStatusStyle(status: string) {
  if (status === "SOLD_OUT") {
    return "text-red-500";
  }
  return "text-blue-600";
}

export default function Events() {
  const { events, error } = useLoaderData<typeof loader>();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("anywhere");
  const [pricing, setPricing] = useState("all");

  const filteredEvents = events.filter((event) => {
    const matchSearch =
      search === "" ||
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.excerpt.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      category === "all" ||
      getCategoryLabel(event).toLowerCase() === category.toLowerCase();

    const matchLocation =
      location === "anywhere" ||
      (event.isOnline && location === "online") ||
      event.city?.toLowerCase() === location.toLowerCase();

    const matchPricing =
      pricing === "all" ||
      (pricing === "free" && parseFloat(event.basePrice) === 0) ||
      (pricing === "paid" && parseFloat(event.basePrice) > 0);

    return matchSearch && matchCategory && matchLocation && matchPricing;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <CalendarDays className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold tracking-[0.2em] text-blue-600 uppercase">
              Community Gatherings
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Event Hub
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Join us in person. From workshops to cultural celebrations, discover
            where we're meeting next and how you can get involved.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-0 bg-gray-50 rounded-xl h-11 focus-visible:ring-1 focus-visible:ring-blue-200"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 pr-8 h-11 text-sm text-gray-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-200"
                >
                  <option value="all">All Categories</option>
                  <option value="learning">Learning</option>
                  <option value="cultural">Cultural</option>
                  <option value="networking">Networking</option>
                  <option value="online">Online</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Location Filter */}
              <div className="relative">
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 pr-8 h-11 text-sm text-gray-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-200"
                >
                  <option value="anywhere">Anywhere</option>
                  <option value="Phnom Penh">Phnom Penh</option>
                  <option value="Siem Reap">Siem Reap</option>
                  <option value="online">Online</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Pricing Filter */}
              <div className="relative">
                <select
                  value={pricing}
                  onChange={(e) => setPricing(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 pr-8 h-11 text-sm text-gray-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-200"
                >
                  <option value="all">All Pricing</option>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Results count & view toggle */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-semibold text-blue-600 tracking-wide uppercase">
            {filteredEvents.length} Event
            {filteredEvents.length !== 1 ? "s" : ""} Available
          </p>
          <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <CalendarDays className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No events found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or check back later.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredEvents.map((event) => (
              <EventListItem key={event.slug} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function EventCard({ event }: { event: EventItem }) {
  const categoryLabel = getCategoryLabel(event);
  const categoryColor = getCategoryColor(categoryLabel);
  const price = formatPrice(event.basePrice || "0");
  const isFree = parseFloat(event.basePrice || "0") === 0;
  const isSoldOut = event.ticketStatus === "SOLD_OUT";

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
      {/* Cover Image */}
      <div className="relative aspect-16/10 overflow-hidden">
        {event.cover ? (
          <img
            src={"https://r2.plumpievents.com/" + event.cover}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <img
            src="/Logofullsize.svg"
            alt="Default Cover"
            className="mt-10 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        {/* Category Badge */}
        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider ${categoryColor}`}
        >
          {categoryLabel}
        </span>
        {/* Favorite Button */}
        <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-sm">
          <Heart className="h-4 w-4 text-gray-500 hover:text-red-500 transition-colors" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Date */}
        <div className="flex items-center gap-1.5 mb-2">
          <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-xs font-medium text-blue-500 uppercase tracking-wide">
            {formatEventDate(event.startDate)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 mb-1.5 line-clamp-1">
          {event.title}
        </h3>

        {/* Excerpt */}
        {event.excerpt && (
          <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
            "
            {event.excerpt.length > 80
              ? event.excerpt.substring(0, 80) + "..."
              : event.excerpt}
            "
          </p>
        )}
        {!event.excerpt && <div className="mb-4" />}

        {/* Location & Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            {event.isOnline ? (
              <>
                <Globe className="h-3.5 w-3.5" />
                <span>Online</span>
              </>
            ) : (
              <>
                <MapPin className="h-3.5 w-3.5" />
                <span>{event.city || "TBA"}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <Ticket className="h-3.5 w-3.5 text-gray-400" />
            <span
              className={`text-sm font-semibold ${
                isFree ? "text-emerald-600" : "text-blue-600"
              }`}
            >
              {price}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <Link to={`/events/${event.slug}`}>
          <Button
            className={`w-full rounded-xl h-11 font-semibold text-sm ${
              isSoldOut
                ? "bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-200"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            disabled={isSoldOut}
          >
            {isSoldOut ? (
              "Sold Out"
            ) : (
              <>
                Get Tickets
                <ArrowRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </Link>
      </div>
    </div>
  );
}

function EventListItem({ event }: { event: EventItem }) {
  const categoryLabel = getCategoryLabel(event);
  const categoryColor = getCategoryColor(categoryLabel);
  const price = formatPrice(event.basePrice);
  const isFree = parseFloat(event.basePrice) === 0;
  const isSoldOut = event.ticketStatus === "SOLD_OUT";

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex">
      {/* Cover Image */}
      <div className="relative w-64 shrink-0 overflow-hidden">
        {event.cover ? (
          <img
            src={"https://r2.plumpievents.com/" + event.cover}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src="/Logofullsize.svg"
            alt="Default Cover"
            className="mt-10 object-cover"
          />
        )}
        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider ${categoryColor}`}
        >
          {categoryLabel}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {formatEventDate(event.startDate)}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {event.title}
          </h3>
          {event.excerpt && (
            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
              "{event.excerpt}"
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              {event.isOnline ? (
                <>
                  <Globe className="h-3.5 w-3.5" />
                  <span>Online</span>
                </>
              ) : (
                <>
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{event.city || "TBA"}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <Ticket className="h-3.5 w-3.5 text-gray-400" />
              <span
                className={`text-sm font-semibold ${
                  isFree ? "text-emerald-600" : "text-blue-600"
                }`}
              >
                {price}
              </span>
            </div>
          </div>

          <Link to={`/events/${event.slug}`}>
            <Button
              className={`rounded-xl px-6 font-semibold text-sm ${
                isSoldOut
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-200"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              disabled={isSoldOut}
            >
              {isSoldOut ? (
                "Sold Out"
              ) : (
                <>
                  Get Tickets
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
