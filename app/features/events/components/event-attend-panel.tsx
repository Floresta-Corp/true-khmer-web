import { ArrowUpRight, Ticket } from "lucide-react";
import { EventTicketList } from "~/features/events/components/event-ticket-list";
import type { EventDetail } from "~/features/events/types/events";

const ENTRY_COPY = {
  TICKETED: {
    name: "Ticketed entry",
    description:
      "Tickets for this event are sold and checked in through Plumpi, our event management partner.",
    cta: "Get tickets on Plumpi",
  },
  RSVP: {
    name: "RSVP",
    description:
      "Reserve your spot with the organizer on Plumpi, our event management partner.",
    cta: "RSVP on Plumpi",
  },
  OPEN_ACCESS: {
    name: "Open access",
    description: "No ticket or registration needed — just turn up on the day.",
    cta: null,
  },
} as const;

/**
 * "Get Tickets" tab.
 *
 * Shows the tier list when `GET /v1/plumpi/events/slug/{slug}` sends one. That
 * endpoint types its event as an open record and does not always carry tiers,
 * so when none come back this falls back to how the visitor gets in
 * (`entryMode`) and hands them off to the event's Plumpi page.
 */
export function EventAttendPanel({ event }: { event: EventDetail }) {
  if (event.tickets.length > 0) {
    return <EventTicketList event={event} />;
  }

  const copy = ENTRY_COPY[event.entryMode];
  const plumpiWeb = import.meta.env.VITE_PLUMPI_WEB;
  const eventUrl =
    copy.cta && plumpiWeb
      ? `${plumpiWeb}/events/${encodeURIComponent(event.slug)}`
      : null;

  return (
    <div>
      <h2 className="mb-1.5 text-[26px] font-extrabold text-[#1A1A2E]">
        How to attend
      </h2>
      <p className="mb-6 text-[15px] text-[#9A9AB0]">
        {copy.cta
          ? "Registration is handled by the organizer on Plumpi"
          : "This event is open to everyone"}
      </p>

      <div className="flex flex-col items-start gap-5 rounded-[14px] border border-[#E5E7EB] p-5 sm:flex-row sm:items-center">
        <span className="flex size-19 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-[#D5E2FA]">
          {event.cover ? (
            <img src={event.cover} alt="" className="size-full object-cover" />
          ) : (
            <Ticket className="size-7 text-[#1C5DD4]" aria-hidden />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <p className="mb-1 text-lg font-extrabold text-[#1A1A2E]">
            {copy.name}
          </p>
          <p className="text-sm text-[#9A9AB0]">{copy.description}</p>
        </div>

        {eventUrl && (
          <a
            href={eventUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#1C5DD4] px-5.5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#174FB4]"
          >
            {copy.cta}
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        )}
      </div>
    </div>
  );
}
