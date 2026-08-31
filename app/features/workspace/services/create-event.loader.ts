import type { Route } from "project-types/workspace/route/+types/my-events.create";
import {
  getPlumpiEventCategories,
  getPlumpiOrganizations,
  getPlumpiVenues,
} from "~/api/events/events.server";
import {
  requestWithSetCookie,
  requireUser,
} from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import {
  EventCategorySchema,
  EventOrganizerSchema,
  EventVenueSchema,
  type CreateEventLoaderData,
} from "~/features/workspace/types/my-events";

const VENUE_LOAD_ERROR = "Unable to load venues. Please try again.";

export async function createEventLoader({ request }: Route.LoaderArgs) {
  const auth = await requireUser(request);
  const apiRequest = requestWithSetCookie(request, auth.setCookie);
  const [categoryResult, organizationResult, venueLoadResult] =
    await Promise.all([
      getPlumpiEventCategories(apiRequest),
      getPlumpiOrganizations(apiRequest),
      getPlumpiVenues(apiRequest)
        .then((result) => ({ result, error: null }))
        .catch((error: unknown) => ({ result: null, error })),
    ]);

  const categories = EventCategorySchema.array().parse(
    categoryResult.data.categories,
  );
  const organizers = EventOrganizerSchema.array().parse(
    organizationResult.data.organizations,
  );
  let venues: CreateEventLoaderData["venues"] = [];
  let venueLoadError: string | null = null;
  if (venueLoadResult.result) {
    const parsedVenues = EventVenueSchema.array().safeParse(
      venueLoadResult.result.data.venues,
    );
    if (parsedVenues.success) {
      venues = parsedVenues.data;
    } else {
      console.error("Plumpi returned invalid venue data:", parsedVenues.error);
      venueLoadError = VENUE_LOAD_ERROR;
    }
  } else {
    console.error("Could not load Plumpi venues:", venueLoadResult.error);
    venueLoadError = VENUE_LOAD_ERROR;
  }

  const setCookie = [
    ...(auth.setCookie ? [auth.setCookie] : []),
    ...(categoryResult.setCookie ? [categoryResult.setCookie] : []),
    ...(organizationResult.setCookie ? [organizationResult.setCookie] : []),
    ...(venueLoadResult.result?.setCookie
      ? [venueLoadResult.result.setCookie]
      : []),
  ];

  return withAuthData({ setCookie }, {
    categories,
    organizers,
    venues,
    venueLoadError,
    userId: auth.user.id || null,
  } satisfies CreateEventLoaderData);
}
