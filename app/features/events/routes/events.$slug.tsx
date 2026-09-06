import { Link, useLoaderData } from "react-router";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { SanitizedHtml } from "~/components/sanitized-html";
import { ImageGallery } from "~/components/image-lightbox";
import { cn } from "~/lib/utils";
import { EventAttendPanel } from "~/features/events/components/event-attend-panel";
import { EventDetailCover } from "~/features/events/components/event-detail-cover";
import { EventDetailOverview } from "~/features/events/components/event-detail-overview";
import { eventDetailLoader } from "~/features/events/services/event-detail.loader";
import type { EventDetail } from "~/features/events/types/events";

export const loader = eventDetailLoader;

export function meta({ data }: { data?: { event: EventDetail | null } }) {
  const title = data?.event?.title;
  return [{ title: title ? `${title} | True Khmer` : "Event | True Khmer" }];
}

type DetailTab = "attend" | "details" | "programs" | "exhibitors";

const TAB_LABELS: Record<DetailTab, string> = {
  attend: "Get Tickets",
  details: "Details",
  programs: "Programs",
  exhibitors: "Exhibitors",
};

function BackToEvents() {
  return (
    <Link
      to="/events"
      className="mb-5 inline-flex items-center gap-1.5 text-base font-bold text-[#9A9AB0] transition-colors hover:text-[#1A1A2E]"
    >
      <ChevronLeft className="size-4.5" aria-hidden />
      Back to Explore
    </Link>
  );
}

export default function EventDetailPage() {
  const { event, loadError } = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState<DetailTab>("attend");
  const [isSaved, setIsSaved] = useState(() => event?.isFavorite ?? false);

  if (!event) {
    return (
      <div className="min-h-screen bg-white">
        <main className="site-container pt-8 pb-12 font-tk-edu sm:pt-12 sm:pb-20">
          <BackToEvents />
          <p className="py-20 text-center text-[15px] text-[#9A9AB0]">
            {loadError ?? "We could not find that event."}
          </p>
        </main>
      </div>
    );
  }

  // Programs and Exhibitors are optional sections the organizer switches on in
  // Plumpi, so the tab row is built from what this event actually has.
  const tabs: DetailTab[] = [
    "attend",
    "details",
    ...(event.features.programs ? (["programs"] as const) : []),
    ...(event.features.exhibitors ? (["exhibitors"] as const) : []),
  ];
  const currentTab = tabs.includes(activeTab) ? activeTab : "attend";
  const hasDescription = Boolean(
    event.description.replace(/<[^>]*>/g, "").trim(),
  );

  return (
    <div className="min-h-screen bg-white">
      <main className="site-container pt-8 pb-12 font-tk-edu sm:pt-12 sm:pb-20">
        <BackToEvents />

        <EventDetailCover
          event={event}
          isSaved={isSaved}
          onToggleSave={() => setIsSaved((saved) => !saved)}
        />

        <h1 className="mb-6 text-[30px] leading-[1.15] font-extrabold text-[#1A1A2E] sm:text-[40px]">
          {event.title}
        </h1>

        <div className="mb-8 flex gap-8 overflow-x-auto border-b border-[#E5E7EB]">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              aria-current={currentTab === tab}
              className={cn(
                "cursor-pointer border-b-2 px-1 py-2.5 text-[17px] font-bold whitespace-nowrap transition-colors",
                currentTab === tab
                  ? "border-[#1C5DD4] text-[#1C5DD4]"
                  : "border-transparent text-[#9A9AB0] hover:text-[#1A1A2E]",
              )}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0">
            {currentTab === "attend" && <EventAttendPanel event={event} />}

            {currentTab === "details" && (
              <div>
                {hasDescription ? (
                  <SanitizedHtml
                    html={event.description}
                    className="text-base leading-[1.65] text-[#9A9AB0] [&_a]:font-semibold [&_a]:text-[#1C5DD4] [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#1A1A2E] [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#1A1A2E] [&_li]:mb-1 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_strong]:text-[#1A1A2E] [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5"
                  />
                ) : (
                  <p className="text-base text-[#9A9AB0]">
                    The organizer has not added a description for this event
                    yet.
                  </p>
                )}

                {event.photos.length > 0 && (
                  <div className="mt-10">
                    <h3 className="mb-3.5 text-xl font-bold text-[#1A1A2E]">
                      Gallery
                    </h3>
                    <ImageGallery
                      images={event.photos}
                      alt={`${event.title} photo`}
                      columns={3}
                    />
                  </div>
                )}
              </div>
            )}

            {(currentTab === "programs" || currentTab === "exhibitors") && (
              <p className="text-base text-[#9A9AB0]">
                The organizer has not published{" "}
                {currentTab === "programs"
                  ? "the programme"
                  : "the exhibitor list"}{" "}
                yet.
              </p>
            )}
          </div>

          <aside className="lg:sticky lg:top-24">
            <EventDetailOverview event={event} />
          </aside>
        </div>
      </main>
    </div>
  );
}
