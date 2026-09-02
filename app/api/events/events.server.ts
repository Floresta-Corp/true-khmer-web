import { z } from "zod";
import {
  apiRequestWithOptionalSession,
  apiRequestWithSession,
} from "~/lib/server/api-client.server";
import { api, schemas, type postV1plumpievents_Body } from "~/types/api-client";
import type { EventType } from "~/features/events/lib/event-types";

type PlumpiApi = typeof api;

const PlumpiHandoffResponseSchema = z.object({
  ok: z.literal(true),
  token: z.string().min(1),
  expiresIn: z.number().positive(),
  expiresAt: z.string().datetime({ offset: true }),
});

export function getPlumpiEventCategories(request: Request) {
  return apiRequestWithSession<
    Awaited<ReturnType<PlumpiApi["getV1plumpieventCategories"]>>
  >(request, "/plumpi/event-categories?page=1&limit=100");
}

export function getPlumpiOrganizations(request: Request) {
  return apiRequestWithSession<
    Awaited<ReturnType<PlumpiApi["getV1plumpiorganizations"]>>
  >(request, "/plumpi/organizations?page=1&limit=100");
}

/**
 * Query for `GET /v1/plumpi/events`, the public event listing Plumpi backs.
 * Only the parameters the True Khmer pages actually use are exposed; the
 * endpoint accepts more (see `getV1plumpievents` in `~/types/api-client`).
 */
export type PlumpiEventsQuery = {
  page?: number;
  limit?: number;
  search?: string;
  eventType?: EventType;
  status?: PlumpiEventStatus;
  visibility?: "LISTED" | "UNLISTED";
  /** ISO date or datetime; keeps only events starting on or after it. */
  startDate?: string;
  sortBy?: "createdAt" | "startAt" | "endAt" | "title" | "status" | "updatedAt";
  sortOrder?: "asc" | "desc";
};

type PlumpiEventStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "COMPLETED"
  | "CANCELLED"
  | "POSTPONED"
  | "ACTIVE"
  | "LIVE"
  | "ARCHIVED";

/**
 * Reads the public event listing.
 *
 * The endpoint needs no authentication, but the session is sent when the
 * visitor has one so `isFavorite` comes back for the right account. An expired
 * session degrades to the anonymous read instead of bouncing a public page to
 * the login screen.
 */
export function getPlumpiEvents(
  request: Request,
  query: PlumpiEventsQuery = {},
) {
  const searchParams = new URLSearchParams({
    page: String(query.page ?? 1),
    limit: String(query.limit ?? 12),
    sortBy: query.sortBy ?? "startAt",
    sortOrder: query.sortOrder ?? "asc",
  });
  if (query.search) searchParams.set("search", query.search);
  if (query.eventType) searchParams.set("eventType", query.eventType);
  if (query.status) searchParams.set("status", query.status);
  if (query.visibility) searchParams.set("visibility", query.visibility);
  if (query.startDate) searchParams.set("startDate", query.startDate);

  return apiRequestWithOptionalSession<
    Awaited<ReturnType<PlumpiApi["getV1plumpievents"]>>
  >(request, `/plumpi/events?${searchParams.toString()}`);
}

/**
 * Reads one public event by its slug — `GET /v1/plumpi/events/slug/{slug}`.
 *
 * Slug, not id: this is the only endpoint that resolves a single public event,
 * and it is keyed on the slug Plumpi puts in its own URLs. Sent with the
 * session when there is one so `isFavorite` is right for the visitor.
 */
export function getPlumpiEventBySlug(request: Request, slug: string) {
  return apiRequestWithOptionalSession<
    Awaited<ReturnType<PlumpiApi["getV1plumpieventsslugSlug"]>>
  >(request, `/plumpi/events/slug/${encodeURIComponent(slug)}`);
}

/**
 * Reads an event's ticket tiers — `GET /v1/plumpi/tickets/tiers?eventId={id}`.
 *
 * Keyed on the event id, not the slug, so the detail page resolves the event
 * first. Public like the event read, with the session attached when there is
 * one.
 */
export function getPlumpiEventTicketTiers(request: Request, eventId: string) {
  const searchParams = new URLSearchParams({ eventId });

  return apiRequestWithOptionalSession<
    Awaited<ReturnType<PlumpiApi["getV1plumpiticketstiers"]>>
  >(request, `/plumpi/tickets/tiers?${searchParams.toString()}`);
}

export type PlumpiMyEventsQuery = {
  page: number;
  limit: number;
  search?: string;
  status?: string;
};

export function getPlumpiMyEvents(
  request: Request,
  query: PlumpiMyEventsQuery,
) {
  const searchParams = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
    sortBy: "startAt",
    sortOrder: "desc",
  });
  if (query.search) searchParams.set("search", query.search);
  if (query.status) searchParams.set("status", query.status);

  return apiRequestWithSession<
    Awaited<ReturnType<PlumpiApi["getV1plumpimyevents"]>>
  >(request, `/plumpi/myevents?${searchParams.toString()}`);
}

export function getPlumpiVenues(request: Request) {
  return apiRequestWithSession<
    Awaited<ReturnType<PlumpiApi["getV1plumpivenues"]>>
  >(request, "/plumpi/venues?page=1&limit=100");
}

export function createPlumpiEvent(
  request: Request,
  input: postV1plumpievents_Body,
) {
  const body = schemas.postV1plumpievents_Body.parse(input);

  return apiRequestWithSession<
    Awaited<ReturnType<PlumpiApi["postV1plumpievents"]>>,
    postV1plumpievents_Body
  >(request, "/plumpi/events", {
    method: "POST",
    body,
  });
}

export function uploadPlumpiEventCover(
  request: Request,
  eventId: string,
  cover: File,
) {
  const body = new FormData();
  body.set("cover", cover, cover.name);

  return apiRequestWithSession<
    Awaited<ReturnType<PlumpiApi["patchV1plumpieventsEventIdcover"]>>,
    FormData
  >(request, `/plumpi/events/${encodeURIComponent(eventId)}/cover`, {
    method: "PATCH",
    body,
  });
}

/**
 * Deep link that drops the organizer straight into an event in the Plumpi
 * console, authenticated by a fresh handoff token.
 */
export function buildPlumpiEventHandoffUrl(
  organizationId: string,
  eventId: string,
  handoffToken: string,
) {
  const baseUrl = process.env.VITE_PLUMPI_WEB?.trim();
  if (!baseUrl) {
    throw new Error("Plumpi web URL is not configured.");
  }

  const nextPath = `/console/${encodeURIComponent(organizationId)}/events/${encodeURIComponent(eventId)}`;
  const url = new URL("/auth/handoff", baseUrl);
  url.searchParams.set("token", handoffToken);
  url.searchParams.set("nextPath", nextPath);
  return url.toString();
}

export async function createPlumpiHandoff(request: Request) {
  const result = await apiRequestWithSession<unknown>(
    request,
    "/plumpi/auth/handoff",
    { method: "POST" },
  );

  return {
    ...result,
    data: PlumpiHandoffResponseSchema.parse(result.data),
  };
}
