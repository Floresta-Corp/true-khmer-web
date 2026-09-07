import { useEffect, useState } from "react";
import { Ticket } from "lucide-react";
import PlumpiRedirectOverlay from "~/components/plumpi-redirect-overlay";
import { cn } from "~/lib/utils";
import {
  buildPlumpiEventUrl,
  buildPlumpiTicketOrderUrl,
} from "~/features/events/lib/plumpi-links";
import type { EventDetail, EventTicket } from "~/features/events/types/events";
import { describeTicketAvailability } from "~/features/events/lib/ticket-availability";

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

function TicketArt({ ticket }: { ticket: EventTicket }) {
  return (
    <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-[#D5E2FA] sm:size-19">
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
  orderUrl,
  onSelect,
  now,
}: {
  ticket: EventTicket;
  /** `null` when the tier cannot be bought, which drops the card's link. */
  orderUrl: string | null;
  /** Raises the redirect hold before the browser leaves for Plumpi. */
  onSelect: () => void;
  now: number;
}) {
  const availability = describeTicketAvailability(ticket, now);
  const price = formatTicketPrice(ticket);
  const isSelectable = Boolean(orderUrl) && availability.isOnSale;

  const body = (
    <>
      <TicketArt ticket={ticket} />

      <div className="min-w-0 flex-1 [overflow-wrap:anywhere]">
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

      <div className="col-span-2 flex min-w-0 flex-wrap items-center justify-between gap-3 sm:col-span-1 sm:flex-col sm:items-end sm:gap-2.5">
        <span className="min-w-0 text-[22px] leading-none font-extrabold [overflow-wrap:anywhere] text-[#1A1A2E]">
          {price}
        </span>
        {isSelectable ? (
          <span className="rounded-lg bg-[#1C5DD4] px-5.5 py-2.5 text-sm font-bold text-white transition-colors group-hover:bg-[#174FB4]">
            Select
          </span>
        ) : (
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-lg bg-[#F3F4F6] px-5.5 py-2.5 text-sm font-bold text-[#9A9AB0]"
          >
            {ticket.isSoldOut ? "Sold out" : "Select"}
          </button>
        )}
      </div>
    </>
  );

  const shell =
    "group grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 rounded-[14px] border border-[#E5E7EB] p-4 sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,auto)] sm:gap-5 sm:p-5";

  if (!isSelectable) {
    return <div className={shell}>{body}</div>;
  }

  return (
    <a
      href={orderUrl!}
      rel="noopener noreferrer"
      aria-label={`Select ${ticket.name} — ${price}`}
      onClick={(event) => {
        if (!describeTicketAvailability(ticket, Date.now()).isOnSale) {
          event.preventDefault();
          return;
        }

        // A modified click is the visitor asking for a new tab or window, so
        // leave it to the browser rather than covering this page with a hold
        // for a navigation that never happens here.
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }

        onSelect();
      }}
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
 * Checkout itself lives on Plumpi, so "Select" hands the visitor to Plumpi's
 * order page with that tier already chosen. The handoff is held behind the
 * same "Redirecting you to Plumpi" card the workspace shows, so leaving True
 * Khmer reads the same wherever it happens.
 */
export function EventTicketList({ event }: { event: EventDetail }) {
  const hasCheckout = Boolean(buildPlumpiEventUrl(event.slug));
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const refresh = () => setNow(Date.now());
    const timer = window.setInterval(refresh, 1000);
    window.addEventListener("focus", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  return (
    <div>
      <h2 className="mb-1.5 text-[26px] font-extrabold text-[#1A1A2E]">
        Select your ticket
      </h2>
      <p className="mb-6 text-[15px] text-[#9A9AB0]">
        {hasCheckout
          ? "Click any ticket to begin the checkout"
          : "Ticketing for this event is handled by the organizer"}
      </p>

      <div className="flex flex-col gap-4">
        {event.tickets.map((ticket) => (
          <TicketRow
            key={ticket.id}
            ticket={ticket}
            orderUrl={buildPlumpiTicketOrderUrl(event.slug, ticket.id)}
            onSelect={() => setIsRedirecting(true)}
            now={now}
          />
        ))}
      </div>

      {isRedirecting && <PlumpiRedirectOverlay />}
    </div>
  );
}
