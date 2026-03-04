import { requireUser } from "~/lib/session.server";
import type { EventData } from "~/components/event-card";

const API_BASE_URL = "https://api-staging.plumpievents.com/v1";

export async function getEventsData(request: Request) {
  const user = await requireUser(request);

  try {
    const response = await fetch(`${API_BASE_URL}/events`);

    if (!response.ok) {
      throw new Error(`Plumpi API Error: ${response.status}`);
    }

    const json = await response.json();
    const eventList = Array.isArray(json.data) ? json.data : [];

    const mappedEvents: EventData[] = eventList.map((apiEvent: any) => ({
      id: apiEvent.id,
      title: apiEvent.name,              // ✅ API uses "name" not "title"
      excerpt: apiEvent.excerpt || "",
      thumbnail: apiEvent.cover || null, // ✅ API uses "cover" not "thumbnail"
      startAt: apiEvent.startAt,
      endAt: apiEvent.endAt,
      venueName: apiEvent.venueName || null,
      eventType: apiEvent.eventType,
      price: apiEvent.salePrice || apiEvent.basePrice || "Free",
      // ❌ description is NOT in the list endpoint — omit here
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

/**
 * Calls GET /events/:id directly — this is the only endpoint that includes "description"
 */
export async function getEventById(request: Request, id: string) {
  const user = await requireUser(request);

  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        return { user, event: null, error: "Event not found." };
      }
      throw new Error(`Plumpi API Error: ${response.status}`);
    }

    const apiEvent = await response.json();

    const event: EventData = {
      id: apiEvent.id,
      title: apiEvent.name,              // ✅ API uses "name"
      excerpt: apiEvent.excerpt || "",
      thumbnail: apiEvent.cover || null, // ✅ API uses "cover"
      startAt: apiEvent.startAt,
      endAt: apiEvent.endAt,
      venueName: apiEvent.venueName || null,
      eventType: apiEvent.eventType,
      price: apiEvent.salePrice || apiEvent.basePrice || "Free",
      description: apiEvent.description || "", // ✅ Only available on /events/:id
    };

    return { user, event, error: null };
  } catch (err) {
    console.error("Failed to fetch event by ID:", err);
    return {
      user,
      event: null,
      error: "Unable to load event details.",
    };
  }
}