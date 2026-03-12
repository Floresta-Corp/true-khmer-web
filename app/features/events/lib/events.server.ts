import { requireUser } from "~/lib/session.server";
import type { EventData } from "~/features/events/components/event-card";

export interface EventCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sortOrder: number;
  status: string;
}

export interface TicketTier {
  id: string;
  name: string;
  description: string | null;
  type: "PAID" | "FREE" | string;
  isActive: boolean;
  isVisible: boolean;
  totalQuantity: number;
  soldCount: number;
  availableCount: number;
  minPurchase: number;
  maxPurchase: number;
  basePrice: string | null;
  salePrice: string | null;
  currencyCode: string;
  saleStartAt: string | null;
  saleEndAt: string | null;
  validFrom: string | null;
  validUntil: string | null;
  status: string;
  benefits: string | null;
  cover: string | null;
}

export interface Organizer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
  totalEvent: string;
}

interface EventPhoto {
  id: string;
  key: string;
  url: string;
}

const PLUMPI_ENDPOINT = process.env.PLUMPI_ENDPOINT;
if (!PLUMPI_ENDPOINT) {
  throw new Error(
    "Environment variable PLUMPI_ENDPOINT is not set. Please configure PLUMPI_ENDPOINT to the base URL of the Plumpi API.",
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
      }));
  } catch (err) {
    console.error("Failed to fetch event categories:", err);
    return [];
  }
}

export async function getTicketTiers(eventId: string): Promise<TicketTier[]> {
  try {
    const response = await fetch(
      `${PLUMPI_ENDPOINT}/tickets/tiers?eventId=${eventId}`,
    );

    if (!response.ok) {
      return [];
    }

    const json = await response.json();
    const tiers = Array.isArray(json.data) ? json.data : [];

    return tiers
      .filter((t: any) => t.isVisible)
      .map((t: any) => ({
        id: t.id,
        name: t.name,
        description: t.description || null,
        type: t.type,
        isActive: t.isActive,
        isVisible: t.isVisible,
        totalQuantity: t.totalQuantity,
        soldCount: t.soldCount,
        availableCount: t.availableCount,
        minPurchase: t.minPurchase,
        maxPurchase: t.maxPurchase,
        basePrice: t.basePrice || null,
        salePrice: t.salePrice || null,
        currencyCode: t.currencyCode || "USD",
        saleStartAt: t.saleStartAt || null,
        saleEndAt: t.saleEndAt || null,
        validFrom: t.validFrom || null,
        validUntil: t.validUntil || null,
        status: t.status,
        benefits: t.benefits || null,
        cover: t.cover || null,
      }));
  } catch (err) {
    console.error("Failed to fetch ticket tiers:", err);
    return [];
  }
}

export async function getEventOrganizer(
  eventId: string,
): Promise<Organizer | null> {
  try {
    const response = await fetch(
      `${PLUMPI_ENDPOINT}/events/${eventId}/organizer`,
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return {
      id: data.id,
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      image: data.image || null,
      totalEvent: data.totalEvent || "0",
    };
  } catch (err) {
    console.error("Failed to fetch event organizer:", err);
    return null;
  }
}

export async function getEventPhotos(eventId: string): Promise<string[]> {
  try {
    const response = await fetch(`${PLUMPI_ENDPOINT}/events/${eventId}/photos`);

    if (!response.ok) {
      return [];
    }

    const json = await response.json();
    const photos = Array.isArray(json.photos) ? json.photos : [];

    return photos
      .map((photo: EventPhoto) => photo.url)
      .filter((photoUrl: string | undefined): photoUrl is string =>
        Boolean(photoUrl),
      );
  } catch (err) {
    console.error("Failed to fetch event photos:", err);
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

export async function getEventById(request: Request, id: string) {
  try {
    const [response, ticketTiers, organizer, photos] = await Promise.all([
      fetch(`${PLUMPI_ENDPOINT}/events/${id}`),
      getTicketTiers(id),
      getEventOrganizer(id),
      getEventPhotos(id),
    ]);

    if (!response.ok) {
      if (response.status === 404) {
        return {
          event: null,
          ticketTiers: [],
          organizer: null,
          error: "Event not found.",
        };
      }
      throw new Error(`Plumpi API Error: ${response.status}`);
    }

    const apiEvent = await response.json();

    const event: EventData = {
      id: apiEvent.id,
      title: apiEvent.title,
      slug: apiEvent.slug,
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
      description: apiEvent.description || "",
      photos,
    };

    return { event, ticketTiers, organizer, error: null };
  } catch (err) {
    console.error("Failed to fetch event by ID:", err);
    return {
      event: null,
      ticketTiers: [],
      organizer: null,
      error: "Unable to load event details.",
    };
  }
}
