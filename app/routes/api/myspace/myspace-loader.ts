import type { Profile, RecentActivity } from "~/services/myspace/types";
import type { Route as MyspaceRoute } from "project-types/myspace/routes/+types/myspace";
import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import { getUserId } from "~/lib/server/session.server";
import {
  GetMyspaceMe,
  GetRecentActivity,
} from "~/services/myspace/server/me.server";

interface MyspaceLoaderData {
  me: Profile | null;
  userId: string | null;
  recentActivities: RecentActivity[];
}

export async function MyspaceLoader({ request }: MyspaceRoute.LoaderArgs) {
  await requireAuthenticatedUser(request);
  const userId = await getUserId(request);
  const [meResult, activitiesResult] = await Promise.allSettled([
    GetMyspaceMe(request),
    GetRecentActivity(request),
  ]);

  return {
    userId,
    me: meResult.status === "fulfilled" ? meResult.value.data.profile : null,
    recentActivities:
      activitiesResult.status === "fulfilled"
        ? activitiesResult.value.data.activities
        : [],
  } satisfies MyspaceLoaderData;
}
