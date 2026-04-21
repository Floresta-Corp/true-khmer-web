import type { Route as VolunteerRoute } from 'project-types/volunteer/routes/+types/volunteer.$id'
import { getUserId } from '~/lib/server/session.server'
import { getOpportunityById, getPublicOpportunityById } from '~/services/volunteer/server/volunteer.opportunities.server';

export async function VolunteerDetailLoader({ request, params }: VolunteerRoute.LoaderArgs) {
    const id = params.id;
    const userId = await getUserId(request);

    const [volunteer] = await Promise.all(userId ? [getOpportunityById(request, id)] : [getPublicOpportunityById(request, id)]);



    return { volunteer: volunteer?.data.opportunity, userId }
}