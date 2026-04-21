import type { Route as VolunteerRoute } from 'project-types/volunteer/routes/+types/volunteer.$id'

export async function VolunteerDetailLoader({ request, params }: VolunteerRoute.LoaderArgs) {
    return { id: params.id, volunteer: null }
}