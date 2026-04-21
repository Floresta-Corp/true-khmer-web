import { GetLaunchpadProjects } from "~/services/launchpad/server/launchpad.server"
import type { Route as LaunchpadRoute } from "project-types/launchpad/routes/+types/launchpad";

export async function LaunchpadLoader({ request }: LaunchpadRoute.LoaderArgs) {
    const projects = await GetLaunchpadProjects()
    return projects
}