import type { Route } from "project-types/myspace/route/+types/myspace";
import type { Profile, RecentActivity } from "~/features/myspace/types";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import {
  GetMyspaceMe,
  GetRecentActivity,
} from "~/routes/api/myspace/myspace.server";

interface MyspaceLoaderData {
  me: Profile | null;
  userId: string | null;
  recentActivities: RecentActivity[];
}

export async function myspaceLoader({ request }: Route.LoaderArgs) {
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
