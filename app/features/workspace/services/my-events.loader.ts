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
  type MyEventsLoaderData,
} from "~/features/workspace/types/my-events";

const PAGE_SIZE = 8;

const LOAD_ERROR = "Unable to load your events. Please try again.";

/** At least one of these events is running right now. */
function isLiveEvent(events: MyEvent[]): boolean {
  return events.some(
    (event) => event.status === MY_EVENT_STATUS_BY_FILTER.live,
  );
}

export async function myEventsLoader({ request }: Route.LoaderArgs) {
  const auth = await requireUser(request);
  const userId = auth.user.id || null;

  if (!userId) {
    return withAuthData(auth, {
      events: [],
      pagination: null,
      hasLiveEvents: false,
      loadError: null,
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

  const apiRequest = requestWithSetCookie(request, auth.setCookie);
  const cookies = auth.setCookie ? [auth.setCookie] : [];

  try {
    const result = await getPlumpiMyEvents(apiRequest, {
      page,
      limit: PAGE_SIZE,
      ...(search ? { search } : {}),
      ...(filter === "all"
        ? {}
        : { status: MY_EVENT_STATUS_BY_FILTER[filter] }),
    });
    if (result.setCookie) cookies.push(result.setCookie);

    // A single malformed row should not blank the page, so rows are parsed
    // individually and the ones Plumpi returns in an unexpected shape are
    // skipped.
    const events = result.data.events.flatMap((event) => {
      const parsed = MyEventSchema.safeParse(event);
      if (!parsed.success) {
        console.error("Skipped a malformed Plumpi event row:", parsed.error);
        return [];
      }
      return [parsed.data];
    });

    const pagination = MyEventsPaginationSchema.parse(result.data.meta);

    // The Live tab has to appear from any other tab, so it cannot be inferred
    // from the filtered page above; a live row is asked for separately, except
    // when the current page already is the live one.
    let hasLiveEvents = isLiveEvent(events);
    if (filter !== "live") {
      try {
        const liveRequest = requestWithSetCookie(
          apiRequest,
          result.setCookie ?? auth.setCookie,
        );
        const liveResult = await getPlumpiMyEvents(liveRequest, {
          page: 1,
          limit: 1,
          status: MY_EVENT_STATUS_BY_FILTER.live,
        });
        if (liveResult.setCookie) cookies.push(liveResult.setCookie);

        // The returned row is checked rather than the total, so the tab stays
        // hidden even if Plumpi ever ignores the status filter.
        hasLiveEvents = isLiveEvent(
          liveResult.data.events.flatMap((event) => {
            const parsed = MyEventSchema.safeParse(event);
            return parsed.success ? [parsed.data] : [];
          }),
        );
      } catch (error) {
        // A missing live count is not worth failing the listing over.
        console.error("Could not check for live Plumpi events:", error);
        hasLiveEvents = false;
      }
    }

    return withAuthData({ setCookie: cookies }, {
      events,
      pagination,
      hasLiveEvents,
      loadError: null,
      userId,
    } satisfies MyEventsLoaderData);
  } catch (error) {
    console.error("Could not load Plumpi my-events:", error);

    return withAuthData({ setCookie: cookies }, {
      events: [],
      pagination: null,
      hasLiveEvents: false,
      loadError: LOAD_ERROR,
      userId,
    } satisfies MyEventsLoaderData);
  }
}
