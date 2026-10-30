import { Link, useLoaderData } from "react-router";
import { ArrowLeft, CalendarDays, PencilLine } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import PlumpiRedirectOverlay from "~/components/plumpi-redirect-overlay";
import { cn } from "~/lib/utils";
import { MY_EVENT_STATUS_COLORS } from "../card/my-event-card";
import CreateEventTopBar from "../create-event/create-event-top-bar";
import EventSummary from "../event-summary/event-summary";
import {
  EVENT_ENTRY_LABELS,
  EVENT_REGISTRATION_LABELS,
  EVENT_VISIBILITY_LABELS,
  MY_EVENT_STATUS_LABELS,
  formatMyEventLongDate,
  formatMyEventTimeRange,
} from "~/features/workspace/lib/my-events-format";
import { PLUMPI_HANDOFF_INTENT } from "~/features/workspace/lib/plumpi-handoff";
import { usePlumpiHandoff } from "~/lib/plumpi/use-plumpi-handoff";
import type {
  EventSummaryView,
  MyEventDetail,
} from "~/features/workspace/types/my-events";
import type { loader } from "../../route/my-events.$eventId";

const MY_EVENTS_PATH = "/my-events";
const TO_BE_CONFIRMED = "To be confirmed";

function toSummaryView(event: MyEventDetail): EventSummaryView {
  return {
    coverUrl: event.coverUrl ?? "",
    name: event.title,
    category: event.categoryName ?? "",
    organizerName: event.organizerName,
    dates: event.dates.length
      ? event.dates.map((date) => ({
          key: date.startAt,
          date: formatMyEventLongDate(date.startAt),
          time: formatMyEventTimeRange(date.startAt, date.endAt),
        }))
      : [
          {
            key: "tba",
            date: "Date to be announced",
            time: "Time to be announced",
          },
        ],
    location: event.venueName || "Location to be announced",
    address: event.address,
    googleMapLink: event.googleMapLink,
    description: event.description,
    access: {
      visibility: event.visibility
        ? EVENT_VISIBILITY_LABELS[event.visibility]
        : TO_BE_CONFIRMED,
      registration: event.registrationMode
        ? EVENT_REGISTRATION_LABELS[event.registrationMode]
        : TO_BE_CONFIRMED,
      entry: event.entryMode
        ? EVENT_ENTRY_LABELS[event.entryMode]
        : TO_BE_CONFIRMED,
    },
  };
}

/**
 * The summary an organizer lands on from My Events: the same read-only view
 * as the create flow's review step, with editing handed over to Plumpi.
 */
export default function MyEventDetailPage() {
  const { event, loadError } = useLoaderData<typeof loader>();
  const { start, isRedirecting } = usePlumpiHandoff({
    popupBlockedMessage: "Allow pop-ups to edit this event in Plumpi.",
    failureMessage: "This event could not be opened in Plumpi.",
  });

  const editInPlumpi = () => {
    if (!event) return;
    if (!event.organizationId) {
      toast.error("This event is not linked to a Plumpi organization yet.");
      return;
    }

    // The My Events action already serves this handoff for the listing.
    start(
      {
        intent: PLUMPI_HANDOFF_INTENT,
        eventId: event.id,
        organizationId: event.organizationId,
      },
      { action: MY_EVENTS_PATH },
    );
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white supports-[height:100dvh]:h-dvh">
      <CreateEventTopBar closeTo={MY_EVENTS_PATH} />

      <div className="min-h-0 flex-1 overflow-y-auto bg-white px-5 pt-11 pb-20 [scrollbar-gutter:stable] md:px-6">
        <div className="mx-auto max-w-220">
          {event ? (
            <EventSummary
              title="Event summary"
              description="Here's how your event is set up. Edit it in Plumpi to change these details, or to manage tickets, program scheduling and guests."
              badge={
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#E1E7EF] bg-white px-3.5 py-1.5 text-xs font-bold">
                  <span
                    className={cn(
                      "size-1.5 rounded-full bg-current",
                      MY_EVENT_STATUS_COLORS[event.status],
                    )}
                  />
                  <span className={MY_EVENT_STATUS_COLORS[event.status]}>
                    {MY_EVENT_STATUS_LABELS[event.status]}
                  </span>
                </span>
              }
              summary={toSummaryView(event)}
            />
          ) : (
            <div className="flex min-h-105 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#E5E7EB] bg-white p-10 text-center">
              <CalendarDays size={42} className="mb-1.5 text-[#E5E7EB]" />
              <div className="text-[16px] font-bold text-[#1A1A2E]">
                This event is unavailable.
              </div>
              <p className="m-0 max-w-110 text-[14px] text-[#9A9AB0]">
                {loadError}
              </p>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
            <Button
              asChild
              variant="outline"
              className="h-11 gap-1.5 rounded-lg border-[#E1E7EF] px-5.5 text-sm font-bold text-[#344256]"
            >
              <Link to={MY_EVENTS_PATH}>
                <ArrowLeft className="size-4" strokeWidth={2.4} />
                Back to My Events
              </Link>
            </Button>

            {event && (
              <Button
                type="button"
                disabled={isRedirecting}
                onClick={editInPlumpi}
                className="ml-auto h-11 gap-2 rounded-lg bg-blue-600 px-6.5 text-sm font-bold text-white hover:bg-blue-700"
              >
                <PencilLine className="size-4" />
                Edit event
              </Button>
            )}
          </div>
        </div>
      </div>

      {isRedirecting && <PlumpiRedirectOverlay />}
    </div>
  );
}
