import type { Route as LaunchpadDetailRoute } from "project-types/launchpad/routes/+types/launchpad.$id";
import { GetLaunchpadProjectById } from "~/services/launchpad/server/launchpad.server";

export async function LaunchpadDetailLoader({ request, params }: LaunchpadDetailRoute.LoaderArgs) {
    const id = params.id;
    const project = await GetLaunchpadProjectById(id ?? "")
    return project
}