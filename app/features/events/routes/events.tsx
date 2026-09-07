import { useLoaderData, useNavigate, useNavigation } from "react-router";
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { EventHero } from "~/features/events/components/event-hero";
import { EventListCard } from "~/features/events/components/event-list-card";
import { EventCardSkeleton } from "~/features/events/components/event-card-skeleton";
import { eventsHubLoader } from "~/features/events/services/events.loader";

export const loader = eventsHubLoader;

export function meta() {
  return [{ title: "Events | True Khmer" }];
}

export default function Events() {
  const { events, loadError } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const prefersReducedMotion = useReducedMotion();
  const [search, setSearch] = useState("");
  const [savedIds, setSavedIds] = useState<string[]>(() =>
    events.filter((event) => event.isFavorite).map((event) => event.id),
  );

  const duration = prefersReducedMotion ? 0 : 0.4;
  const sectionDelay = prefersReducedMotion ? 0 : 0.18;
  const isLoadingEvents =
    navigation.state === "loading" &&
    navigation.location?.pathname === "/events";

  const toggleSave = (eventId: string) => {
    setSavedIds((current) =>
      current.includes(eventId)
        ? current.filter((id) => id !== eventId)
        : [...current, eventId],
    );
  };

  const submitSearch = () => {
    const query = search.trim();
    navigate(
      query ? `/events/all?search=${encodeURIComponent(query)}` : "/events/all",
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, ease: "easeOut" as const }}
      className="min-h-screen bg-white"
    >
      <main className="site-container pt-8 pb-12 font-tk-edu sm:pt-12 sm:pb-20">
        <EventHero
          search={search}
          onSearchChange={setSearch}
          onSearchSubmit={submitSearch}
        />

        {loadError ? (
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration,
              delay: sectionDelay,
              ease: "easeOut" as const,
            }}
            className="flex items-center justify-center gap-2 rounded-lg bg-red-50 p-4 text-red-500"
          >
            <AlertCircle className="size-5 shrink-0" aria-hidden />
            <p className="text-sm">{loadError}</p>
          </motion.div>
        ) : (
          <motion.section
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration,
              delay: sectionDelay,
              ease: "easeOut" as const,
            }}
            className="will-change-transform"
          >
            <h2 className="mb-4 text-[22px] font-extrabold text-[#1A1A2E]">
              Upcoming Events
            </h2>

            {isLoadingEvents ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <EventCardSkeleton key={`event-skeleton-${index}`} />
                ))}
              </div>
            ) : events.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: prefersReducedMotion ? 0 : 0.04,
                      delayChildren: prefersReducedMotion ? 0 : sectionDelay + 0.08,
                    },
                  },
                }}
              >
                {events.map((event) => (
                  <motion.div
                    key={event.id}
                    variants={{
                      hidden: {
                        opacity: 0,
                        y: prefersReducedMotion ? 0 : 18,
                        scale: prefersReducedMotion ? 1 : 0.98,
                      },
                      show: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          duration: prefersReducedMotion ? 0 : 0.2,
                          ease: "easeOut" as const,
                        },
                      },
                    }}
                    style={{ willChange: "transform, opacity" }}
                  >
                    <EventListCard
                      event={event}
                      isSaved={savedIds.includes(event.id)}
                      onToggleSave={toggleSave}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <p className="py-15 text-center text-sm text-[#9A9AB0]">
                No upcoming events yet. Check back soon.
              </p>
            )}
          </motion.section>
        )}
      </main>
    </motion.div>
  );
}
