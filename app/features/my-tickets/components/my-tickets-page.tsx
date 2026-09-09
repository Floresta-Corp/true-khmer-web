import { useEffect, useState } from "react";
import { Link, useLoaderData, useNavigation } from "react-router";
import { Ticket } from "lucide-react";
import type { loader } from "../route/my-tickets";
import type { MyTicket } from "../types";
import { ticketDetailsSchema } from "../lib/ticket-schema";
import TicketCard from "./ticket-card";
import TicketModal from "./ticket-modal";
import TicketLoadingModal from "./ticket-loading-modal";
import SpacePagination from "~/components/space-pagination";

export default function MyTicketsPage() {
  const { tab, tickets, pagination, counts } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [eventId, setEventId] = useState<string | null>(null);
  const [detail, setDetail] = useState<MyTicket | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!eventId) return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const deadline = Date.now() + 120_000;
    setDetail(null);
    setError(null);
    async function load() {
      try {
        const response = await fetch(
          `/api/my-tickets/event/${encodeURIComponent(eventId!)}`,
          { signal: controller.signal },
        );
        if (!response.ok)
          throw new Error("Unable to load your tickets. Please try again.");
        const data = ticketDetailsSchema.parse(await response.json());
        if (controller.signal.aborted) return;
        setDetail(data);
        if (
          data.tickets.some((ticket) => !ticket.qrUrl) &&
          Date.now() < deadline
        )
          timer = setTimeout(load, 5000);
      } catch {
        if (!controller.signal.aborted)
          setError("Unable to load your tickets. Please try again.");
      }
    }
    void load();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [eventId]);
  function closeDetails() {
    setEventId(null);
    setDetail(null);
    setError(null);
  }
  return (
    <main className="flex min-h-full bg-white px-4 py-8 sm:px-6 sm:py-10 lg:p-12">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
        <h1 className="mb-6 text-3xl font-medium">My Tickets</h1>
        <nav
          aria-label="Ticket filters"
          className="flex gap-2 border-b border-gray-200 px-0 sm:gap-10 sm:px-5"
        >
          {(["upcoming", "past"] as const).map((value) => (
            <Link
              key={value}
              to={`?tab=${value}`}
              aria-current={tab === value ? "page" : undefined}
              className={`relative min-w-0 px-2 pb-3 text-center text-sm leading-tight font-medium whitespace-normal capitalize transition-colors sm:px-6 sm:pb-4 sm:text-lg ${tab === value ? "text-[#126dfb]" : "text-gray-400"}`}
            >
              {value} ({counts[value]})
              {tab === value && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#126dfb]" />
              )}
            </Link>
          ))}
        </nav>
        {error && (
          <div
            role="alert"
            className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
            <button
              type="button"
              onClick={closeDetails}
              className="font-semibold underline"
            >
              Dismiss
            </button>
          </div>
        )}
        <div
          aria-busy={navigation.state !== "idle"}
          className={`mt-8 transition-opacity ${navigation.state !== "idle" ? "opacity-50" : ""}`}
        >
          {tickets.length ? (
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
              {tickets.map((ticket) => (
                <TicketCard
                  key={ticket.eventId}
                  isPast={tab === "past"}
                  data={ticket}
                  onClick={(value) => setEventId(value.eventId)}
                />
              ))}
            </div>
          ) : (
            <div className="mt-12 flex flex-col items-center py-12 text-center">
              <Ticket className="mb-6 h-16 w-16 text-gray-300" />
              <h2 className="text-xl font-semibold">No Tickets Found</h2>
              <p className="mt-2 text-gray-500">
                You don&apos;t have any {tab} tickets yet.
              </p>
            </div>
          )}
        </div>
        {pagination.total > 0 && (
          <div className="mt-auto pt-10">
            <SpacePagination
              total={pagination.total}
              totalPages={pagination.totalPages}
              pageSize={pagination.limit}
              itemLabel="events"
            />
          </div>
        )}
        {eventId && !detail && !error && (
          <TicketLoadingModal
            event={tickets.find((ticket) => ticket.eventId === eventId)}
            onClose={closeDetails}
          />
        )}
        {detail && (
          <TicketModal key={eventId} data={detail} onClose={closeDetails} />
        )}
      </div>
    </main>
  );
}
