import type { Route } from "project-types/workspace/route/+types/my-events";
import z from "zod";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { MY_EVENTS } from "~/features/workspace/lib/my-events.mock";
import {
  MyEventFilterSchema,
  MyEventFormatFilterSchema,
  type MyEvent,
  type MyEventsLoaderData,
} from "~/features/workspace/types/my-events";

const PAGE_SIZE = 6;

const STATUS_BY_FILTER = {
  draft: "DRAFT",
  published: "PUBLISHED",
  live: "LIVE",
  ended: "ENDED",
  cancelled: "CANCELLED",
} as const;

const FORMAT_BY_FILTER = {
  in_person: "IN_PERSON",
  online: "ONLINE",
  hybrid: "HYBRID",
} as const;

function matchesSearch(event: MyEvent, search: string) {
  const haystack = [event.title, event.description, event.category, event.venue]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(search);
}

export async function myEventsLoader({ request }: Route.LoaderArgs) {
  const auth = await requireUser(request);
  const userId = auth.user.id;

  if (!userId) {
    return withAuthData(auth, {
      events: [],
      pagination: null,
      userId: null,
    } satisfies MyEventsLoaderData);
  }

  const url = new URL(request.url);

  const filterResult = MyEventFilterSchema.safeParse(
    url.searchParams.get("filter"),
  );
  const filter = filterResult.success ? filterResult.data : "all";

  const formatResult = MyEventFormatFilterSchema.safeParse(
    url.searchParams.get("format"),
  );
  const format = formatResult.success ? formatResult.data : "all";

  const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();

  const pageResult = z.coerce
    .number()
    .int()
    .positive()
    .safeParse(url.searchParams.get("page"));
  const requestedPage = pageResult.success ? pageResult.data : 1;

  // TODO: replace the in-memory filtering below with a call to the events
  // service once `GET /events/mine` is available. The query shape (filter,
  // format, search, page) is what the page already puts in the URL.
  const matches = MY_EVENTS.filter((event) => {
    const matchesStatus =
      filter === "all" || event.status === STATUS_BY_FILTER[filter];
    const matchesFormat =
      format === "all" || event.format === FORMAT_BY_FILTER[format];

    return (
      matchesStatus &&
      matchesFormat &&
      (!search || matchesSearch(event, search))
    );
  });

  const total = matches.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const start = (page - 1) * PAGE_SIZE;

  return withAuthData(auth, {
    events: matches.slice(start, start + PAGE_SIZE),
    pagination: {
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      limit: PAGE_SIZE,
      page,
      total,
      totalPages,
    },
    userId,
  } satisfies MyEventsLoaderData);
}
