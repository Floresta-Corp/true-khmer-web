import type { api } from "~/types/api-client";
import { apiRequestWithSession } from "~/lib/server/api-client.server";
import {
  eventSummarySchema,
  ticketDetailsSchema,
} from "~/features/my-tickets/lib/ticket-schema";

type PlumpiApi = typeof api;
export async function getMyTickets(
  request: Request,
  timeFilter: "upcoming" | "past",
  page = 1,
  limit = 12,
) {
  const query = new URLSearchParams({
    timeFilter,
    page: String(page),
    limit: String(limit),
  });
  const result = await apiRequestWithSession<
    Awaited<ReturnType<PlumpiApi["getV1plumpiticketsme"]>>
  >(request, `/plumpi/tickets/me?${query}`);
  return {
    ...result,
    data: {
      ...result.data,
      tickets: eventSummarySchema.array().parse(result.data.tickets),
    },
  };
}
export async function getEventTickets(request: Request, eventId: string) {
  const result = await apiRequestWithSession<
    Awaited<ReturnType<PlumpiApi["getV1plumpiticketseventEventId"]>>
  >(request, `/plumpi/tickets/event/${encodeURIComponent(eventId)}`);
  return { ...result, data: ticketDetailsSchema.parse(result.data) };
}
