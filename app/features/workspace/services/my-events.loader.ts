import type { Route } from "project-types/workspace/route/+types/my-events";
import z from "zod";
import { getPlumpiMyEvents } from "~/api/events/events.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import {
  requestWithSetCookie,
  requireUser,
} from "~/lib/server/route-guards.server";
import {
  MY_EVENT_STATUS_BY_FILTER,
  MyEventFilterSchema,
  MyEventSchema,
  MyEventsPaginationSchema,
  type MyEvent,
  type MyEventStatus,
  type MyEventsContent,
  type MyEventsLoaderData,
} from "~/features/workspace/types/my-events";

const PAGE_SIZE = 8;

const LOAD_ERROR = "Unable to load your events. Please try again.";

const EMPTY_CONTENT: MyEventsContent = {
  events: [],
  pagination: null,
  loadError: null,
};

/** At least one of these events is running right now. */
function isLiveEvent(events: MyEvent[]): boolean {
  return events.some(
    (event) => event.status === MY_EVENT_STATUS_BY_FILTER.live,
  );
}

/**
 * A single malformed row should not blank the page, so rows are parsed
 * individually and the ones Plumpi returns in an unexpected shape are skipped.
 */
function parseEvents(rows: unknown[]): MyEvent[] {
  return rows.flatMap((row) => {
    const parsed = MyEventSchema.safeParse(row);
    if (!parsed.success) {
      console.error("Skipped a malformed Plumpi event row:", parsed.error);
      return [];
    }
    return [parsed.data];
  });
}

/**
 * The page of events the grid renders. Awaited by the route's `<Await>` rather
 * than by the loader, so the shell and the filters paint before Plumpi answers.
 * Failures resolve into `loadError` so the deferred promise never rejects.
 */
async function loadEventsPage(
  request: Request,
  query: { page: number; search: string; status?: MyEventStatus },
): Promise<MyEventsContent> {
  try {
    const result = await getPlumpiMyEvents(request, {
      page: query.page,
      limit: PAGE_SIZE,
      ...(query.search ? { search: query.search } : {}),
      ...(query.status ? { status: query.status } : {}),
    });

    return {
      events: parseEvents(result.data.events),
      pagination: MyEventsPaginationSchema.parse(result.data.meta),
      loadError: null,
    };
  } catch (error) {
    console.error("Could not load Plumpi my-events:", error);
    return { ...EMPTY_CONTENT, loadError: LOAD_ERROR };
  }
}

/**
 * The Live tab has to appear from any other tab, so it cannot be inferred from
 * the filtered page above; a live row is asked for separately. A missing live
 * count is not worth failing the listing over.
 */
async function loadHasLiveEvents(request: Request): Promise<boolean> {
  try {
    const result = await getPlumpiMyEvents(request, {
      page: 1,
      limit: 1,
      status: MY_EVENT_STATUS_BY_FILTER.live,
    });

    // The returned row is checked rather than the total, so the tab stays
    // hidden even if Plumpi ever ignores the status filter.
    return isLiveEvent(parseEvents(result.data.events));
  } catch (error) {
    console.error("Could not check for live Plumpi events:", error);
    return false;
  }
}

export async function myEventsLoader({ request }: Route.LoaderArgs) {
  const auth = await requireUser(request);
  const userId = auth.user.id || null;

  if (!userId) {
    return withAuthData(auth, {
      content: Promise.resolve(EMPTY_CONTENT),
      hasLiveEvents: Promise.resolve(false),
      userId: null,
    } satisfies MyEventsLoaderData);
  }

  const url = new URL(request.url);

  const filterResult = MyEventFilterSchema.safeParse(
    url.searchParams.get("filter"),
  );
  const filter = filterResult.success ? filterResult.data : "all";

  const search = (url.searchParams.get("search") ?? "").trim();

  const pageResult = z.coerce
    .number()
    .int()
    .positive()
    .safeParse(url.searchParams.get("page"));
  const page = pageResult.success ? pageResult.data : 1;

  // Only the session cookie the guard may have refreshed can reach the response
  // headers; the streamed Plumpi calls below start after they are sent, so any
  // cookie they refresh is left for the next document request.
  const apiRequest = requestWithSetCookie(request, auth.setCookie);

  const content = loadEventsPage(apiRequest, {
    page,
    search,
    ...(filter === "all" ? {} : { status: MY_EVENT_STATUS_BY_FILTER[filter] }),
  });

  // On the Live tab the page itself already answers the question, so the extra
  // request is skipped; everywhere else it runs alongside the listing.
  const hasLiveEvents =
    filter === "live"
      ? content.then(({ events }) => isLiveEvent(events))
      : loadHasLiveEvents(apiRequest);

  return withAuthData(auth, {
    content,
    hasLiveEvents,
    userId,
  } satisfies MyEventsLoaderData);
}
