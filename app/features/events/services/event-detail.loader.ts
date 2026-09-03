import type { Route } from "project-types/events/routes/+types/events.$slug";
import {
  getPlumpiEventBySlug,
  getPlumpiEventTicketTiers,
} from "~/api/events/events.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import {
  EventDetailSchema,
  parseEventTickets,
  type EventDetailLoaderData,
  type EventTicket,
} from "~/features/events/types/events";

const NOT_FOUND = "We could not find that event. It may have been removed.";
const LOAD_ERROR = "Unable to load this event right now. Please try again.";

/**
 * The event's ticket tiers, from `GET /v1/plumpi/tickets/tiers`.
 *
 * Plumpi is upstream of this endpoint and answers 502 when it cannot list
 * tiers, so a failure degrades to no tiers — the page then shows how to attend
 * instead of failing the whole read over a section of one tab.
 */
async function loadTicketTiers(
  request: Request,
  eventId: string,
): Promise<EventTicket[]> {
  try {
    const result = await getPlumpiEventTicketTiers(request, eventId);
    return parseEventTickets(result.data.ticketTiers);
  } catch (error) {
    console.error("Could not load the Plumpi ticket tiers:", error);
    return [];
  }
}

/**
 * One public event, addressed by slug.
 *
 * A missing event and a failing read are both rendered by the page rather than
 * thrown, so a bad link shows the events shell instead of the error boundary.
 */
export async function eventDetailLoader({ params, request }: Route.LoaderArgs) {
  try {
    const result = await getPlumpiEventBySlug(request, params.slug);
    const parsed = EventDetailSchema.safeParse(result.data.event);

    if (!parsed.success) {
      console.error("Plumpi returned an unexpected event shape:", parsed.error);
      return withAuthData({ setCookie: result.setCookie }, {
        event: null,
        loadError: LOAD_ERROR,
      } satisfies EventDetailLoaderData);
    }

    // Tiers live on their own endpoint, keyed on the event id the read above
    // resolves, so they can only be fetched once the event is known.
    const tickets = await loadTicketTiers(request, parsed.data.id);

    return withAuthData({ setCookie: result.setCookie }, {
      event: { ...parsed.data, tickets },
      loadError: null,
    } satisfies EventDetailLoaderData);
  } catch (error) {
    const isMissing =
      error instanceof ProtectedApiError && error.status === 404;
    if (!isMissing) {
      console.error("Could not load the Plumpi event detail:", error);
    }

    return withAuthData({}, {
      event: null,
      loadError: isMissing ? NOT_FOUND : LOAD_ERROR,
    } satisfies EventDetailLoaderData);
  }
}
