import type { Route } from "project-types/workspace/route/+types/my-events.$eventId";
import z from "zod";
import {
  getPlumpiEventCategories,
  getPlumpiMyEvent,
} from "~/api/events/events.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import {
  requestWithSetCookie,
  requireUser,
} from "~/lib/server/route-guards.server";
import {
  EventCategorySchema,
  MyEventDetailSchema,
  type MyEventDetail,
  type MyEventDetailLoaderData,
} from "~/features/workspace/types/my-events";

const NOT_FOUND =
  "We could not find this event. It may have been removed, or it belongs to an organization you are no longer part of.";
const LOAD_ERROR = "Unable to load this event right now. Please try again.";

/**
 * Plumpi may send the event's categories as bare ids; those are named from the
 * category list. A failed lookup only hides the category chip.
 */
async function resolveCategoryName(
  request: Request,
  event: MyEventDetail,
): Promise<string | null> {
  if (event.categoryName || event.categoryIds.length === 0) {
    return event.categoryName;
  }

  try {
    const result = await getPlumpiEventCategories(request);
    const categories = EventCategorySchema.array().parse(
      result.data.categories,
    );
    return (
      categories.find((category) => event.categoryIds.includes(category.id))
        ?.name ?? null
    );
  } catch (error) {
    console.error("Could not name the event category:", error);
    return null;
  }
}

/**
 * One event the organizer runs, for the summary page reached from My Events.
 * A missing event and a failing read are rendered by the page rather than
 * thrown, so a stale link still offers the way back to the listing.
 */
export async function myEventDetailLoader({
  params,
  request,
}: Route.LoaderArgs) {
  const auth = await requireUser(request);

  if (!z.string().uuid().safeParse(params.eventId).success) {
    return withAuthData(auth, {
      event: null,
      loadError: NOT_FOUND,
    } satisfies MyEventDetailLoaderData);
  }

  const apiRequest = requestWithSetCookie(request, auth.setCookie);

  try {
    const result = await getPlumpiMyEvent(apiRequest, params.eventId);
    const parsed = MyEventDetailSchema.safeParse(result.data.event);

    if (!parsed.success) {
      console.error("Plumpi returned an unexpected event shape:", parsed.error);
      return withAuthData(auth, {
        event: null,
        loadError: LOAD_ERROR,
      } satisfies MyEventDetailLoaderData);
    }

    const categoryName = await resolveCategoryName(apiRequest, parsed.data);
    const setCookie = [
      ...(auth.setCookie ? [auth.setCookie] : []),
      ...(result.setCookie ? [result.setCookie] : []),
    ];

    return withAuthData({ setCookie }, {
      event: { ...parsed.data, categoryName },
      loadError: null,
    } satisfies MyEventDetailLoaderData);
  } catch (error) {
    const isMissing =
      error instanceof ProtectedApiError &&
      (error.status === 404 || error.status === 403);
    if (!isMissing) {
      console.error("Could not load the Plumpi event summary:", error);
    }

    return withAuthData(auth, {
      event: null,
      loadError: isMissing ? NOT_FOUND : LOAD_ERROR,
    } satisfies MyEventDetailLoaderData);
  }
}
