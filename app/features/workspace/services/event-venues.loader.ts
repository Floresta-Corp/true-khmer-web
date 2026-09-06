import { z } from "zod";
import { getPlumpiVenues } from "~/api/events/events.server";
import {
  AuthSessionExpiredError,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import {
  requestWithSetCookie,
  requireUser,
} from "~/lib/server/route-guards.server";
import {
  EventVenueSchema,
  VENUE_SEARCH_PAGE_SIZE,
  type VenueSearchResponse,
} from "~/features/workspace/types/my-events";

const VenueSearchParamsSchema = z.object({
  search: z.string().trim().optional().default(""),
  page: z.coerce.number().int().gte(1).optional().default(1),
});

function failure(
  search: string,
  page: number,
  message: string,
  status: number,
): Response {
  return Response.json(
    { ok: false, search, page, hasMore: false, venues: [], message },
    { status },
  );
}

/**
 * Backs the venue suggestion dropdown. Plumpi does the matching and the
 * paging — the browser only ever holds the pages it has scrolled through.
 */
export async function eventVenuesLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const params = VenueSearchParamsSchema.safeParse({
    search: url.searchParams.get("search") ?? undefined,
    page: url.searchParams.get("page") ?? undefined,
  });

  if (!params.success) {
    return failure("", 1, "Invalid venue search parameters", 400);
  }

  const { search, page } = params.data;

  try {
    const auth = await requireUser(request);
    const apiRequest = requestWithSetCookie(request, auth.setCookie);
    const result = await getPlumpiVenues(apiRequest, {
      page,
      limit: VENUE_SEARCH_PAGE_SIZE,
      search: search || undefined,
    });

    const parsedVenues = EventVenueSchema.array().safeParse(result.data.venues);
    if (!parsedVenues.success) {
      console.error("Plumpi returned invalid venue data:", parsedVenues.error);
      return failure(search, page, "Venues are temporarily unavailable", 502);
    }

    const meta = result.data.meta;
    const setCookie = [
      ...(auth.setCookie ? [auth.setCookie] : []),
      ...(result.setCookie ? [result.setCookie] : []),
    ];

    return Response.json(
      {
        ok: true,
        search,
        page,
        hasMore: meta.page < meta.totalPages,
        venues: parsedVenues.data,
      } satisfies VenueSearchResponse,
      setCookie.length
        ? { headers: { "Set-Cookie": setCookie[0] } }
        : undefined,
    );
  } catch (error) {
    // The guard signals a redirect by throwing a Response — pass it through
    // rather than reporting it as a failed venue lookup.
    if (error instanceof Response) throw error;

    if (error instanceof AuthSessionExpiredError) {
      return failure(search, page, error.message, 401);
    }
    if (error instanceof ProtectedApiError) {
      return failure(search, page, error.message, error.status);
    }

    console.error("Could not load Plumpi venues:", error);
    return failure(search, page, "Unable to load venues", 500);
  }
}
