import { getVolunteerCategories } from "~/services/volunteer/server/volunteer.categories.server";
import type { Route as VolunteerRoute } from "../../../features/volunteer/routes/+types/volunteer";


export async function volunteerLoader({ request }: VolunteerRoute.LoaderArgs) {
    const categories = await getVolunteerCategories(request)
    return { categories: categories?.data }
}

