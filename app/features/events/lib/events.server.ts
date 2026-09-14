import type { EventData } from "~/features/events/components/event-card";
import {
  getPlumpiEventCategories,
  getPlumpiEvents,
  type PlumpiEventsQuery,
} from "~/api/events/events.server";
import { AuthSessionExpiredError } from "~/lib/server/api-client.server";
import { EVENT_TYPES, type EventType } from "./event-types";
import type { EventCategory, TicketTier, Organizer } from "./event-types";

export {
  EVENT_TYPES,
  type EventType,
  type EventCategory,
  type TicketTier,
  type Organizer,
};

/**
 * Event reads for the listing pages.
 *
 * Everything goes through our own API, never Plumpi directly: the provider
 * requires an API key that only the API holds, so a fetch from here comes back
 * 401. The proxy endpoints also attach the visitor's session when there is one,
 * which is what makes `isFavorite` correct per account.
 */

/** How many rows the "all events" grid pulls in one page. */
const EVENT_LIST_LIMIT = 100;

type PlumpiEventRow = {
  id: string;
  title: string;
  excerpt?: string | null;
  slug?: string | null;
  thumbnail?: string | null;
  startAt: string;
  endAt?: string | null;
  venueName?: string | null;
  eventType?: string | null;
  basePrice?: string | number | null;
  salePrice?: string | number | null;
  ticketStatus?: string | null;
  isOnline?: boolean | null;
  isFavorite?: boolean | null;
};

function toEventData(event: PlumpiEventRow): EventData {
  return {
    id: event.id,
    title: event.title,
    excerpt: event.excerpt || "",
    slug: event.slug || "",
    thumbnail: event.thumbnail || null,
    startAt: event.startAt,
    endAt: event.endAt ?? event.startAt,
    venueName: event.venueName || null,
    eventType: event.eventType || "OTHER",
    price: String(event.salePrice || event.basePrice || "Free"),
    ticketStatus: event.ticketStatus || undefined,
    isOnline: event.isOnline || false,
    isFavorite: event.isFavorite || false,
  };
}

async function readEvents(
  request: Request,
  query: PlumpiEventsQuery,
  label: string,
): Promise<EventData[]> {
  try {
    const result = await getPlumpiEvents(request, query);
    return (result.data.events ?? []).map((event) =>
      toEventData(event as PlumpiEventRow),
    );
  } catch (err) {
    console.error(`Failed to fetch ${label}:`, err);
    return [];
  }
}

/**
 * Category list for the carousel. The proxy endpoint needs a session, so a
 * signed-out visitor gets no categories rather than an error page — the grid
 * itself stays public.
 */
export async function getEventCategories(
  request: Request,
): Promise<EventCategory[]> {
  try {
    const result = await getPlumpiEventCategories(request);
    const categories = (result.data.categories ?? []) as Array<
      Record<string, unknown>
    >;

    return categories
      .filter((c) => c.status === "ACTIVE")
      .sort((a, b) => Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0))
      .map((c) => ({
        id: String(c.id),
        name: String(c.name),
        slug: String(c.slug ?? ""),
        description: String(c.description ?? ""),
        icon: String(c.icon ?? "📌"),
        color: String(c.color ?? "#6B7280"),
        sortOrder: Number(c.sortOrder ?? 0),
        status: String(c.status) as EventCategory["status"],
        eventCount: Number(c.eventCount ?? 0),
      }));
  } catch (err) {
    if (err instanceof AuthSessionExpiredError) return [];
    console.error("Failed to fetch event categories:", err);
    return [];
  }
}

export async function getEventsByType(
  request: Request,
  eventType: EventType,
): Promise<EventData[]> {
  return readEvents(
    request,
    { eventType, limit: EVENT_LIST_LIMIT },
    `events of type ${eventType}`,
  );
}

export async function getEventsByCategory(
  request: Request,
  categoryId: string,
): Promise<EventData[]> {
  return readEvents(
    request,
    { categoryId, limit: EVENT_LIST_LIMIT },
    "events by category",
  );
}

export async function getEventList(request: Request): Promise<EventData[]> {
  return readEvents(request, { limit: EVENT_LIST_LIMIT }, "event list");
}
