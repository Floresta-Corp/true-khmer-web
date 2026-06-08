import type { Profile, RecentActivity } from "~/services/myspace/types";
import type { Route as MyspaceRoute } from "project-types/myspace/routes/+types/myspace";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
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
  const auth = await requireUser(request);
  const userId = auth.user.id;
  const [meResult, activitiesResult] = await Promise.allSettled([
    GetMyspaceMe(request),
    GetRecentActivity(request),
  ]);

  return withAuthData(auth, {
    userId,
    me: meResult.status === "fulfilled" ? meResult.value.data.profile : null,
    recentActivities:
      activitiesResult.status === "fulfilled"
        ? activitiesResult.value.data.activities
        : [],
  } satisfies MyspaceLoaderData);
}
