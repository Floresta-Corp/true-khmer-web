import { useLoaderData } from "react-router";
import { useState, useRef, useEffect } from "react";
import type { Route } from "./+types/events";
import { requireUser } from "~/lib/session.server";
import { EventCard, type EventData } from "~/components/event-card";
import { Navbar } from "~/components/navbar";
import { Footer } from "~/components/footer";
import { Search, AlertCircle, ChevronDown, ChevronUp, Check } from "lucide-react";

const API_BASE_URL = "https://api-staging.plumpievents.com/v1";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request);

  try {
    const response = await fetch(`${API_BASE_URL}/events`);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const eventList = Array.isArray(data.data) ? data.data : [];

    const mappedEvents: EventData[] = eventList.map((apiEvent: any) => ({
      id: apiEvent.id,
      title: apiEvent.name,           // ✅ API uses "name"
      excerpt: apiEvent.excerpt || "",
      thumbnail: apiEvent.cover || null, // ✅ API uses "cover"
      startAt: apiEvent.startAt,
      endAt: apiEvent.endAt,
      venueName: apiEvent.venueName || null,
      eventType: apiEvent.eventType,
      price: apiEvent.salePrice || apiEvent.basePrice || "Free",
    }));

    return { user, events: mappedEvents, error: null };
  } catch (err) {
    console.error("Loader fetch error:", err);
    return {
      user,
      events: [],
      error: "Failed to load events. Please check your connection.",
    };
  }
}

export function meta() {
  return [{ title: "Events | True Khmer" }];
}

const CATEGORIES = ["All Categories", "Networking", "Workshop", "Cultural", "Concert", "Exhibition", "Conference", "Festival"];
const LOCATIONS = ["Anywhere", "Physical", "Virtual"];
const PRICING = ["All Pricing", "Free", "Paid"];

function Dropdown({
  options,
  value,
  onChange,
}: {
  options: string[];
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
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap min-w-[110px] justify-between ${
          open ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"
        }`}
      >
        <span>{value}</span>
        {open ? <ChevronUp className="w-4 h-4 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 flex-shrink-0" />}
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 min-w-[180px] z-50">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors"
            >
              <span className={`w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 ${
                value === opt ? "bg-blue-600 border-blue-600" : "border-gray-300"
              }`}>
                {value === opt && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </span>
              <span className={`whitespace-nowrap ${value === opt ? "font-semibold" : ""}`}>{opt}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EventsPage() {
  const { user, events, error } = useLoaderData<typeof loader>();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [location, setLocation] = useState("Anywhere");
  const [pricing, setPricing] = useState("All Pricing");

  // Filter logic
  const filteredEvents = events.filter((event) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      event.title?.toLowerCase().includes(q) ||
      event.venueName?.toLowerCase().includes(q) ||
      event.excerpt?.toLowerCase().includes(q);

    const matchesCategory =
      category === "All Categories" ||
      event.eventType?.toLowerCase() === category.toLowerCase();

    const matchesLocation =
      location === "Anywhere" ||
      event.eventType?.toLowerCase() === location.toLowerCase();

    const matchesPricing =
      pricing === "All Pricing" ||
      (pricing === "Free" && (!event.price || event.price === "Free")) ||
      (pricing === "Paid" && event.price && event.price !== "Free");

    return matchesSearch && matchesCategory && matchesLocation && matchesPricing;
  });

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar user={user} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#eef1f8] pt-20 pb-12 px-6">
        {/* Left circle */}
        <div className="absolute left-0 top-0 w-72 h-72 rounded-full bg-[#d6daf0] opacity-60 -translate-x-1/3 -translate-y-1/4 pointer-events-none" />
        {/* Right circle — clipped by overflow-hidden */}
        <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-[#c8cee8] opacity-50 translate-x-1/3 translate-y-1/4 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-[#1a2340] mb-4 tracking-tight">
            Find your next gathering.
          </h1>
          <p className="text-base text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Connecting you to the best workshops, cultural events, and networking
            circles in Phnom Penh and beyond. Explore experiences built for our community.
          </p>

          {/* One big white pill */}
          <div
            style={{ backgroundColor: "#ffffff", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
            className="max-w-4xl mx-auto rounded-full flex items-center h-14 px-5 gap-3"
          >
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events by title, venue, or keyword..."
              style={{
                background: "#ffffff",
                boxShadow: "none",
                border: "none",
                outline: "none",
                color: "#6b7280",
                WebkitAppearance: "none",
                MozAppearance: "none",
                appearance: "none",
                borderRadius: 0,
                padding: 0,
                margin: 0,
              }}
              className="flex-1 min-w-0 text-sm [border:none!important] [box-shadow:none!important] [outline:none!important] [background:white!important]"
            />
            <div className="w-px h-6 bg-gray-200 flex-shrink-0" />
            <Dropdown options={CATEGORIES} value={category} onChange={setCategory} />
            <div className="w-px h-6 bg-gray-200 flex-shrink-0" />
            <Dropdown options={LOCATIONS} value={location} onChange={setLocation} />
            <div className="w-px h-6 bg-gray-200 flex-shrink-0" />
            <Dropdown options={PRICING} value={pricing} onChange={setPricing} />
          </div>

          {/* Supported by */}
          <p className="mt-6 text-xs text-gray-400 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 inline-block" />
            Supported by: Plumpi Event Management
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 inline-block" />
          </p>
        </div>
      </section>

      {/* Events Section */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {error && (
          <div className="flex items-center justify-center gap-2 text-red-500 bg-red-50 p-4 rounded-lg mb-6">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {!error && filteredEvents.length > 0 ? (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-primary">Featured Gatherings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        ) : !error && (
          <p className="text-center text-muted-foreground py-10">No events found.</p>
        )}
      </main>

      <Footer />
    </div>
  );
}
