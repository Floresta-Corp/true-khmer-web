import { Ticket } from "lucide-react";
import { cn } from "~/lib/utils";
import type { EventDetail, EventTicket } from "~/features/events/types/events";

/** "$10.00", or the tier's own currency when it is not USD. */
function formatTicketPrice(ticket: EventTicket): string {
  if (ticket.price === null || ticket.price === 0) return "Free";

  const currency = ticket.currencyCode?.toUpperCase();
  if (!currency || currency === "USD") return `$${ticket.price.toFixed(2)}`;

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(ticket.price);
  } catch {
    return `${ticket.price.toFixed(2)} ${currency}`;
  }
}

type Availability = { label: string; isOnSale: boolean };

/** The line under the tier name: whether the tier is sold out. */
function describeAvailability(ticket: EventTicket): Availability {
  if (ticket.isSoldOut) return { label: "Sold out", isOnSale: false };
  return { label: "Available now", isOnSale: true };
}

function TicketArt({ ticket }: { ticket: EventTicket }) {
  return (
    <span className="flex size-19 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-[#D5E2FA]">
      {ticket.image ? (
        <img
          src={ticket.image}
          alt=""
          className="size-full object-cover"
          loading="lazy"
        />
      ) : (
        <Ticket className="size-7 text-[#1C5DD4]" aria-hidden />
      )}
    </span>
  );
}

function TicketRow({
  ticket,
  checkoutUrl,
}: {
  ticket: EventTicket;
  /** `null` when the tier cannot be bought, which drops the card's link. */
  checkoutUrl: string | null;
}) {
  const availability = describeAvailability(ticket);
  const price = formatTicketPrice(ticket);
  const isSelectable = Boolean(checkoutUrl) && !ticket.isSoldOut;

  const body = (
    <>
      <TicketArt ticket={ticket} />

      <div className="min-w-0 flex-1">
        <p className="mb-1 text-lg font-extrabold text-[#1A1A2E]">
          {ticket.name}
        </p>
        {ticket.description && (
          <p className="mb-1.5 text-sm text-[#9A9AB0]">{ticket.description}</p>
        )}
        <p
          className={cn(
            "flex items-center gap-1.5 text-[13px] font-bold",
            availability.isOnSale ? "text-[#1FC16B]" : "text-[#9A9AB0]",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "size-1.5 shrink-0 rounded-full",
              availability.isOnSale ? "bg-[#1FC16B]" : "bg-[#9A9AB0]",
            )}
          />
          {availability.label}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-start gap-2.5 sm:items-end">
        <span className="text-[22px] leading-none font-extrabold text-[#1A1A2E]">
          {price}
        </span>
        {isSelectable ? (
          <span className="rounded-lg bg-[#1C5DD4] px-5.5 py-2.5 text-sm font-bold text-white transition-colors group-hover:bg-[#174FB4]">
            Select
          </span>
        ) : (
          ticket.isSoldOut && (
            <span className="rounded-lg bg-[#F3F4F6] px-5.5 py-2.5 text-sm font-bold text-[#9A9AB0]">
              Sold out
            </span>
          )
        )}
      </div>
    </>
  );

  const shell =
    "group flex flex-col items-start gap-5 rounded-[14px] border border-[#E5E7EB] p-5 sm:flex-row sm:items-center";

  if (!isSelectable) {
    return <div className={shell}>{body}</div>;
  }

  return (
    <a
      href={checkoutUrl!}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Select ${ticket.name} — ${price}`}
      className={cn(
        shell,
        "transition-colors hover:border-[#1C5DD4] hover:bg-[#F8FAFF]",
      )}
    >
      {body}
    </a>
  );
}

/**
 * "Select your ticket" — the tier list on the Get Tickets tab.
 *
 * Checkout itself lives on Plumpi, so each row hands the visitor to the
 * event's Plumpi page with the chosen tier preselected.
 */
export function EventTicketList({ event }: { event: EventDetail }) {
  const plumpiWeb = import.meta.env.VITE_PLUMPI_WEB;
  const eventUrl = plumpiWeb
    ? `${plumpiWeb}/events/${encodeURIComponent(event.slug)}`
    : null;

  return (
    <div>
      <h2 className="mb-1.5 text-[26px] font-extrabold text-[#1A1A2E]">
        Select your ticket
      </h2>
      <p className="mb-6 text-[15px] text-[#9A9AB0]">
        {eventUrl
          ? "Click any ticket to begin the checkout"
          : "Ticketing for this event is handled by the organizer"}
      </p>

      <div className="flex flex-col gap-4">
        {event.tickets.map((ticket) => (
          <TicketRow
            key={ticket.id}
            ticket={ticket}
            checkoutUrl={
              eventUrl
                ? `${eventUrl}?ticket=${encodeURIComponent(ticket.id)}`
                : null
            }
          />
        ))}
      </div>
    </div>
  );
}
