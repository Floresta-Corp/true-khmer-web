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
