import type { Route as LaunchpadDetailRoute } from "project-types/launchpad/route/+types/launchpad.$id";
import { GetLaunchpadDetail } from "~/api/launchpad/launchpad.server";
import { getUserId } from "~/lib/server/session.server";

export async function launchpadDetailLoader({
  request,
  params,
}: LaunchpadDetailRoute.LoaderArgs) {
  const id = params.id;
  if (id !== "post") {
    const [project, userId] = await Promise.all([
      GetLaunchpadDetail(id, request),
      getUserId(request),
    ]);
    if (!project) {
      throw new Response("Project not found", { status: 404 });
    }
    return { project, userId };
  } else {
    throw new Response("Project not found", { status: 404 });
  }
}
