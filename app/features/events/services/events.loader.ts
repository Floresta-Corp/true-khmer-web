import type { Route } from "project-types/events/routes/+types/events";
import { getPlumpiEvents } from "~/api/events/events.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import {
  EventListItemSchema,
  type EventsHubLoaderData,
} from "~/features/events/types/events";

/** One screen of cards on the hub; the rest live behind "All events". */
const HUB_EVENT_LIMIT = 12;

const LOAD_ERROR = "Unable to load events right now. Please try again.";

/**
 * Events hub listing.
 *
 * Reads the published, publicly listed events that have not started yet,
 * soonest first, which is what the design's "Upcoming Events" grid shows.
 */
export async function eventsHubLoader({ request }: Route.LoaderArgs) {
  try {
    const result = await getPlumpiEvents(request, {
      limit: HUB_EVENT_LIMIT,
      status: "PUBLISHED",
      visibility: "LISTED",
      startDate: new Date().toISOString(),
      sortBy: "startAt",
      sortOrder: "asc",
    });

    // One malformed row should not blank the grid, so rows are parsed
    // individually and the unexpected ones are dropped.
    const events = result.data.events.flatMap((event) => {
      const parsed = EventListItemSchema.safeParse(event);
      if (!parsed.success) {
        console.error("Skipped a malformed Plumpi event row:", parsed.error);
        return [];
      }
      return [parsed.data];
    });

    return withAuthData({ setCookie: result.setCookie }, {
      events,
      loadError: null,
    } satisfies EventsHubLoaderData);
  } catch (error) {
    console.error("Could not load the public Plumpi event listing:", error);

    return withAuthData({}, {
      events: [],
      loadError: LOAD_ERROR,
    } satisfies EventsHubLoaderData);
  }
}
