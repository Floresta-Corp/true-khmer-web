import type { Route } from "project-types/workspace/route/+types/my-events.create";
import {
  getPlumpiEventCategories,
  getPlumpiOrganizations,
} from "~/api/events/events.server";
import {
  requestWithSetCookie,
  requireUser,
} from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import {
  EventCategorySchema,
  EventOrganizerSchema,
  type CreateEventLoaderData,
} from "~/features/workspace/types/my-events";

export async function createEventLoader({ request }: Route.LoaderArgs) {
  const auth = await requireUser(request);
  const apiRequest = requestWithSetCookie(request, auth.setCookie);
  const [categoryResult, organizationResult] = await Promise.all([
    getPlumpiEventCategories(apiRequest),
    getPlumpiOrganizations(apiRequest),
  ]);

  const categories = EventCategorySchema.array().parse(
    categoryResult.data.categories,
  );
  const organizers = EventOrganizerSchema.array().parse(
    organizationResult.data.organizations,
  );

  const setCookie = [
    ...(Array.isArray(auth.setCookie)
      ? auth.setCookie
      : auth.setCookie
        ? [auth.setCookie]
        : []),
    ...(categoryResult.setCookie ? [categoryResult.setCookie] : []),
    ...(organizationResult.setCookie ? [organizationResult.setCookie] : []),
  ];

  return withAuthData({ setCookie }, {
    categories,
    organizers,
    userId: auth.user.id || null,
  } satisfies CreateEventLoaderData);
}
