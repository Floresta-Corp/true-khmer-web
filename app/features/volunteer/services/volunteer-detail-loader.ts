import type { Route as VolunteerRoute } from "project-types/volunteer/route/+types/volunteer.$id";
import { getUserId } from "~/lib/server/session.server";
import {
  getOpportunityById,
  getPublicOpportunityById,
} from "~/api/volunteer/volunteer.opportunities.server";
import type { GetReportingTypesResponse } from "~/types/api-client";
import { getReportReasons } from "~/api/reporting";

export async function VolunteerDetailLoader({
  request,
  params,
}: VolunteerRoute.LoaderArgs) {
  const userId = await getUserId(request);
  const [volunteer, reportReasons] = await Promise.all([
    userId
      ? getOpportunityById(request, params.id)
      : getPublicOpportunityById(request, params.id),
    getReportReasons(request),
  ]);
  return { volunteer: volunteer?.data.opportunity, userId, reportReasons };
}
