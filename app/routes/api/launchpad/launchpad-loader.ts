import type { Route as LaunchpadRoute } from "project-types/launchpad/routes/+types/launchpad";
import { GetLaunchpadProjects } from "~/services/launchpad/launchpad.server";

export async function LaunchpadLoader({ request }: LaunchpadRoute.LoaderArgs) {
  const projects = await GetLaunchpadProjects();
  return projects;
}
