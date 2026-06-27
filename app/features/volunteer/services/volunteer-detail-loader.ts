import type { Route as VolunteerRoute } from "project-types/volunteer/route/+types/volunteer.$id";
import { getUserId } from "~/lib/server/session.server";
import {
  getOpportunityById,
  getPublicOpportunityById,
} from "~/api/volunteer/volunteer.opportunities.server";

export async function VolunteerDetailLoader({
  request,
  params,
}: VolunteerRoute.LoaderArgs) {
  const userId = await getUserId(request);
  const [volunteer] = await Promise.all(
    userId
      ? [getOpportunityById(request, params.id)]
      : [getPublicOpportunityById(request, params.id)],
  );
  return { volunteer: volunteer?.data.opportunity, userId };
}
