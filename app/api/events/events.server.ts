import { z } from "zod";
import { apiRequestWithSession } from "~/lib/server/api-client.server";
import { api, schemas, type postV1plumpievents_Body } from "~/types/api-client";

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
