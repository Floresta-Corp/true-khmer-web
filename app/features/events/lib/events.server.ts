import type { EventData } from "~/features/events/components/event-card";
import { requireUser } from "~/lib/server/route-guards.server";
import { EVENT_TYPES, type EventType } from "./event-types";
import type { EventCategory, TicketTier, Organizer } from "./event-types";

export {
  EVENT_TYPES,
  type EventType,
  type EventCategory,
  type TicketTier,
  type Organizer,
};

const PLUMPI_ENDPOINT = process.env.PLUMPI_ENDPOINT;
if (!PLUMPI_ENDPOINT) {
  console.warn(
    "PLUMPI_ENDPOINT is not set. Event data requests will fail until it is configured.",
  );
}

export async function getEventCategories(): Promise<EventCategory[]> {
  try {
    const response = await fetch(`${PLUMPI_ENDPOINT}/event-categories`);

    if (!response.ok) {
      return [];
    }

    const json = await response.json();
    const categories = Array.isArray(json.data) ? json.data : [];

    return categories
      .filter((c: any) => c.status === "ACTIVE")
      .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
      .map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || "",
        icon: c.icon || "📌",
        color: c.color || "#6B7280",
        sortOrder: c.sortOrder,
        status: c.status,
        eventCount: c.eventCount || 0,
      }));
  } catch (err) {
    console.error("Failed to fetch event categories:", err);
    return [];
  }
}

export async function getEventsData(request: Request) {
  const user = await requireUser(request);

  try {
    const response = await fetch(`${PLUMPI_ENDPOINT}/events?limit=5`);

    if (!response.ok) {
      throw new Error(`Plumpi API Error: ${response.status}`);
    }

    const json = await response.json();
    const eventList = Array.isArray(json.data) ? json.data : [];

    const mappedEvents: EventData[] = eventList.map((apiEvent: any) => ({
      id: apiEvent.id,
      title: apiEvent.title,
      excerpt: apiEvent.excerpt || "",
      slug: apiEvent.slug || "",
      thumbnail: apiEvent.thumbnail || null,
      startAt: apiEvent.startAt,
      endAt: apiEvent.endAt,
      venueName: apiEvent.venueName || null,
      eventType: apiEvent.eventType,
      price: apiEvent.salePrice || apiEvent.basePrice || "Free",
      ticketStatus: apiEvent.ticketStatus || null,
      isOnline: apiEvent.isOnline || false,
      isFavorite: apiEvent.isFavorite || false,
    }));

    return { user, events: mappedEvents, error: null };
  } catch (err) {
    console.error("Failed to fetch events:", err);
    return {
      user,
      events: [],
      error: "Unable to load events from the server.",
    };
  }
}

export async function getUpcomingEvents(): Promise<EventData[]> {
  try {
    const response = await fetch(`${PLUMPI_ENDPOINT}/events/upcoming`);

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const eventList = Array.isArray(data) ? data : [];

    return eventList.map((apiEvent: any) => ({
      id: apiEvent.id,
      title: apiEvent.name || apiEvent.title || "",
      slug: apiEvent.slug || "",
      excerpt: apiEvent.excerpt || "",
      thumbnail: apiEvent.cover || apiEvent.thumbnail || null,
      cover: apiEvent.cover || null,
      startAt: apiEvent.startAt,
      endAt: apiEvent.endAt,
      venueName: apiEvent.venueName || null,
      eventType: apiEvent.eventType,
      price: apiEvent.salePrice || apiEvent.basePrice || "Free",
      ticketStatus: apiEvent.ticketStatus || null,
      isOnline: apiEvent.isOnline || false,
      isFavorite: apiEvent.isFavorite || false,
    }));
  } catch (err) {
    console.error("Failed to fetch upcoming events:", err);
    return [];
  }
}

export async function getEventsByType(
  eventType: EventType,
): Promise<EventData[]> {
  try {
    const response = await fetch(
      `${PLUMPI_ENDPOINT}/events?eventType=${eventType}`,
    );

    if (!response.ok) {
      throw new Error(`Plumpi API Error: ${response.status}`);
    }

    const json = await response.json();
    const eventList = Array.isArray(json.data) ? json.data : [];

    return eventList.map((apiEvent: any) => ({
      id: apiEvent.id,
      title: apiEvent.title,
      excerpt: apiEvent.excerpt || "",
      slug: apiEvent.slug || "",
      thumbnail: apiEvent.thumbnail || null,
      startAt: apiEvent.startAt,
      endAt: apiEvent.endAt,
      venueName: apiEvent.venueName || null,
      eventType: apiEvent.eventType,
      price: apiEvent.salePrice || apiEvent.basePrice || "Free",
      ticketStatus: apiEvent.ticketStatus || null,
      isOnline: apiEvent.isOnline || false,
      isFavorite: apiEvent.isFavorite || false,
    }));
  } catch (err) {
    console.error("Failed to fetch events by type:", err);
    return [];
  }
}

export async function getEventsByCategory(
  categoryId: string,
): Promise<EventData[]> {
  try {
    const response = await fetch(
      `${PLUMPI_ENDPOINT}/events?categoryId=${categoryId}`,
    );

    if (!response.ok) {
      throw new Error(`Plumpi API Error: ${response.status}`);
    }

    const json = await response.json();
    const eventList = Array.isArray(json.data) ? json.data : [];

    return eventList.map((apiEvent: any) => ({
      id: apiEvent.id,
      title: apiEvent.title,
      excerpt: apiEvent.excerpt || "",
      thumbnail: apiEvent.thumbnail || null,
      startAt: apiEvent.startAt,
      endAt: apiEvent.endAt,
      venueName: apiEvent.venueName || null,
      eventType: apiEvent.eventType,
      price: apiEvent.salePrice || apiEvent.basePrice || "Free",
      ticketStatus: apiEvent.ticketStatus || null,
      isOnline: apiEvent.isOnline || false,
      isFavorite: apiEvent.isFavorite || false,
    }));
  } catch (err) {
    console.error("Failed to fetch events by category:", err);
    return [];
  }
}

export async function getEventList(): Promise<EventData[]> {
  try {
    const response = await fetch(`${PLUMPI_ENDPOINT}/events`);

    if (!response.ok) {
      throw new Error(`Plumpi API Error: ${response.status}`);
    }

    const json = await response.json();
    const eventList = Array.isArray(json.data) ? json.data : [];

    return eventList.map((apiEvent: any) => ({
      id: apiEvent.id,
      title: apiEvent.title,
      excerpt: apiEvent.excerpt || "",
      slug: apiEvent.slug || "",
      thumbnail: apiEvent.thumbnail || null,
      startAt: apiEvent.startAt,
      endAt: apiEvent.endAt,
      venueName: apiEvent.venueName || null,
      eventType: apiEvent.eventType,
      price: apiEvent.salePrice || apiEvent.basePrice || "Free",
      ticketStatus: apiEvent.ticketStatus || null,
      isOnline: apiEvent.isOnline || false,
      isFavorite: apiEvent.isFavorite || false,
    }));
  } catch (err) {
    console.error("Failed to fetch event list:", err);
    return [];
  }
}
