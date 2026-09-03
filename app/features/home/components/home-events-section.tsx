import { useState } from "react";
import { Link } from "react-router";
import { Bookmark, CalendarDays, MapPin } from "lucide-react";
import { motion, MotionConfig } from "motion/react";
import { slideUpVariants, staggerContainerVariants } from "./home-motion";

interface HomeEvent {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  thumbnail: string;
  /** Pre-formatted for the mock, e.g. "Thu, Sep 3 · 6:00 – 8:00 PM" */
  schedule: string;
  venueName: string;
  /** `null` renders as "Free" */
  price: number | null;
  isSaved?: boolean;
}

// TODO: replace with the events loader once the endpoint is wired up.
const DUMMY_EVENTS: HomeEvent[] = [
  {
    id: "1",
    category: "Tech",
    title: "Phnom Penh Tech Founders Meetup",
    excerpt:
      "Monthly meetup for founders and engineers building startups in Cambodia.",
    thumbnail:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=60",
    schedule: "Thu, Sep 3 · 6:00 – 8:00 PM",
    venueName: "Phnom Penh",
    price: null,
    isSaved: true,
  },
  {
    id: "2",
    category: "Business",
    title: "Startup Pitch Night",
    excerpt:
      "Early-stage founders pitch to a panel of local and regional investors.",
    thumbnail:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=60",
    schedule: "Sat, Sep 12 · 3:00 – 6:00 PM",
    venueName: "Sofitel Phnom Penh Phokeethra",
    price: 10,
    isSaved: true,
  },
  {
    id: "3",
    category: "Design",
    title: "Khmer Ceramics Workshop",
    excerpt: "Hands-on pottery session guided by local ceramicists.",
    thumbnail:
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=60",
    schedule: "Wed, Sep 17 · 1:00 – 4:00 PM",
    venueName: "Chaktomuk Conference Hall",
    price: 15,
  },
  {
    id: "4",
    category: "Music",
    title: "Riverside Jazz Night",
    excerpt:
      "An evening of live jazz along the riverside with local and touring musicians.",
    thumbnail:
      "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=800&q=60",
    schedule: "Fri, Sep 19 · 7:00 – 10:00 PM",
    venueName: "Sisowath Quay Riverside",
    price: 12,
  },
];

export function HomeEventsSection({
  events = DUMMY_EVENTS,
}: {
  events?: HomeEvent[];
}) {
  if (events.length === 0) return null;

  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        className="py-6 lg:py-8"
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="site-container">
          <motion.div
            variants={slideUpVariants}
            className="mb-5 flex items-center justify-between gap-4"
          >
            <h2 className="text-2xl font-bold tracking-[-0.04em] text-[#333333]">
              Upcoming events
            </h2>
            <Link
              to="/events/all"
              className="shrink-0 text-sm font-semibold text-[#1c5dd4] transition-colors hover:text-[#2f6fe4]"
            >
              See all
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {events.slice(0, 4).map((event) => (
              <motion.div key={event.id} variants={slideUpVariants}>
                <HomeEventCard event={event} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </MotionConfig>
  );
}

function HomeEventCard({ event }: { event: HomeEvent }) {
  const [saved, setSaved] = useState(Boolean(event.isSaved));

  return (
    <Link
      to={`/events/detail/${event.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#e1e7ef] bg-white transition-colors hover:border-[#2f6fe4]"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-[#f1f5f9]">
        <img
          src={event.thumbnail}
          alt=""
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1e293b] shadow-sm">
          {event.category}
        </span>
        <button
          type="button"
          aria-label={saved ? "Remove from saved" : "Save event"}
          aria-pressed={saved}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSaved((value) => !value);
          }}
          className={`absolute top-3 right-3 flex size-8 cursor-pointer items-center justify-center rounded-full shadow-sm transition-colors ${
            saved
              ? "bg-[#1c5dd4] text-white"
              : "bg-white/90 text-[#94a3b8] hover:text-[#1c5dd4]"
          }`}
        >
          <Bookmark
            className={`size-4 ${saved ? "fill-current" : ""}`}
            strokeWidth={2}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
          <CalendarDays className="size-3.5 shrink-0" />
          <span className="truncate">{event.schedule}</span>
        </div>

        <h3 className="mt-2 line-clamp-2 text-base font-bold text-[#1e293b] transition-colors group-hover:text-[#1c5dd4]">
          {event.title}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-sm text-[#94a3b8]">
          {event.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#eef2f6] pt-3">
          <span className="flex min-w-0 items-center gap-1.5 text-xs text-[#94a3b8]">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">{event.venueName}</span>
          </span>
          <span
            className={`shrink-0 text-sm font-bold ${
              event.price === null ? "text-[#16a34a]" : "text-[#1c5dd4]"
            }`}
          >
            {event.price === null ? "Free" : `$${event.price.toFixed(2)}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
