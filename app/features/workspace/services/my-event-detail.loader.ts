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

type CategoryLookup = { name: string | null; setCookie?: string };

async function resolveCategoryName(
  request: Request,
  event: MyEventDetail,
): Promise<CategoryLookup> {
  if (event.categoryName || event.categoryIds.length === 0) {
    return { name: event.categoryName };
  }

  let pageRequest = request;
  let setCookie: string | undefined;

  try {
    for (let page = 1, totalPages = 1; page <= totalPages; page++) {
      const result = await getPlumpiEventCategories(pageRequest, page);
      if (result.setCookie) {
        setCookie = result.setCookie;
        pageRequest = requestWithSetCookie(pageRequest, setCookie);
      }
      totalPages = result.data.meta.totalPages;

      // Entries are checked one by one so a malformed sibling is skipped.
      for (const entry of result.data.categories) {
        const category = EventCategorySchema.safeParse(entry);
        if (category.success && event.categoryIds.includes(category.data.id)) {
          return { name: category.data.name, setCookie };
        }
      }
    }
    return { name: null, setCookie };
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error("Could not name the event category:", error);
    return { name: null, setCookie };
  }
}

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

    // A session refreshed by the event read is reused for the category lookup.
    const category = await resolveCategoryName(
      requestWithSetCookie(apiRequest, result.setCookie),
      parsed.data,
    );
    const setCookie = [
      auth.setCookie,
      result.setCookie,
      category.setCookie,
    ].filter((cookie): cookie is string => Boolean(cookie));

    return withAuthData({ setCookie }, {
      event: { ...parsed.data, categoryName: category.name },
      loadError: null,
    } satisfies MyEventDetailLoaderData);
  } catch (error) {
    if (error instanceof Response) throw error;

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
