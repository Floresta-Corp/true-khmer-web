import type { Route as LaunchpadDetailRoute } from "project-types/launchpad/routes/+types/launchpad.$id";
import { GetLaunchpadDetail } from "~/services/launchpad/server/launchpad.opportunities.server";

export async function LaunchpadDetailLoader({
  request,
  params,
}: LaunchpadDetailRoute.LoaderArgs) {
  const id = params.id;
  if (id !== "post") {
    const project = await GetLaunchpadDetail(id, request);
    return project;
  } else {
    return null;
  }
}
