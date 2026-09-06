import { useLoaderData, useNavigate } from "react-router";
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { EventHero } from "~/features/events/components/event-hero";
import { EventListCard } from "~/features/events/components/event-list-card";
import { eventsHubLoader } from "~/features/events/services/events.loader";

export const loader = eventsHubLoader;

export function meta() {
  return [{ title: "Events | True Khmer" }];
}

export default function Events() {
  const { events, loadError } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [savedIds, setSavedIds] = useState<string[]>(() =>
    events.filter((event) => event.isFavorite).map((event) => event.id),
  );

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
    <div className="min-h-screen bg-white">
      <main className="site-container pt-8 pb-12 font-tk-edu sm:pt-12 sm:pb-20">
        <EventHero
          search={search}
          onSearchChange={setSearch}
          onSearchSubmit={submitSearch}
        />

        {loadError ? (
          <div className="flex items-center justify-center gap-2 rounded-lg bg-red-50 p-4 text-red-500">
            <AlertCircle className="size-5 shrink-0" aria-hidden />
            <p className="text-sm">{loadError}</p>
          </div>
        ) : (
          <section>
            <h2 className="mb-4 text-[22px] font-extrabold text-[#1A1A2E]">
              Upcoming Events
            </h2>

            {events.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {events.map((event) => (
                  <EventListCard
                    key={event.id}
                    event={event}
                    isSaved={savedIds.includes(event.id)}
                    onToggleSave={toggleSave}
                  />
                ))}
              </div>
            ) : (
              <p className="py-15 text-center text-sm text-[#9A9AB0]">
                No upcoming events yet. Check back soon.
              </p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
