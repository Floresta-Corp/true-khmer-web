import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useOutletContext } from "react-router";
import {
  getPlumpiEventBySlug,
  getPlumpiEventTicketTiers,
} from "~/api/events/events.server";
import { EventAttendPanel } from "~/features/events/components/event-attend-panel";
import { readString } from "~/features/events/lib/public-event-data";
import {
  parseEventTickets,
  type EventDetailOutletContext,
} from "~/features/events/types/events";
import { readOptional } from "~/lib/server/api-client.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const eventResult = await readOptional("event ticket context", () =>
    getPlumpiEventBySlug(request, params.slug ?? ""),
  );
  const eventId = eventResult ? readString(eventResult.data.event, "id") : null;
  if (!eventId) return { tickets: [] };

  const tiersResult = await readOptional("event ticket tiers", () =>
    getPlumpiEventTicketTiers(request, eventId),
  );
  return {
    tickets: parseEventTickets(tiersResult?.data.ticketTiers ?? []),
  };
}

export default function EventDetailAttendRoute() {
  const { event, isAuthenticated } =
    useOutletContext<EventDetailOutletContext>();
  const { tickets } = useLoaderData<typeof loader>();

  return (
    <EventAttendPanel
      event={{ ...event, tickets }}
      isAuthenticated={isAuthenticated}
    />
  );
}
