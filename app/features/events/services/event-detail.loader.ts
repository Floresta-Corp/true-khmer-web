import type { Route } from "project-types/events/routes/+types/events.$slug";
import { getPlumpiEventBySlug } from "~/api/events/events.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import {
  EventDetailSchema,
  type EventDetailLoaderData,
} from "~/features/events/types/events";

const NOT_FOUND = "We could not find that event. It may have been removed.";
const LOAD_ERROR = "Unable to load this event right now. Please try again.";

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

    return withAuthData({ setCookie: result.setCookie }, {
      event: parsed.data,
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
