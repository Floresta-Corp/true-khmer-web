import type { Route } from "project-types/myspace/route/+types/community-standing";
import {
  StandingTabSchema,
  type GetLeaderboardResponse,
  type GetPointsHistoryResponse,
  type GetTiersResponse,
  type StandingTab,
} from "~/features/myspace/types";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import {
  GetLeaderboard,
  GetPointsHistory,
  GetTiers,
} from "~/api/myspace/myspace.server";

export const POINTS_HISTORY_PAGE_SIZE = 20;

interface CommunityStandingLoaderData {
  tab: StandingTab;
  page: number;
  history: Omit<GetPointsHistoryResponse, "ok"> | null;
  leaderboard: Omit<GetLeaderboardResponse, "ok"> | null;
  tiers: Omit<GetTiersResponse, "ok"> | null;
}

export async function communityStandingLoader({
  request,
}: Route.LoaderArgs) {
  const auth = await requireUser(request);
  const searchParams = new URL(request.url).searchParams;
  const tab = StandingTabSchema.catch("points").parse(searchParams.get("tab"));
  const page = Math.max(Math.trunc(Number(searchParams.get("page"))) || 1, 1);

  const [historyResult, leaderboardResult, tiersResult] =
    await Promise.allSettled([
      GetPointsHistory(request, {
        limit: POINTS_HISTORY_PAGE_SIZE,
        offset: (page - 1) * POINTS_HISTORY_PAGE_SIZE,
      }),
      GetLeaderboard(request),
      GetTiers(request),
    ]);

  for (const [name, result] of [
    ["points history", historyResult],
    ["leaderboard", leaderboardResult],
    ["tiers", tiersResult],
  ] as const) {
    if (result.status === "rejected") {
      console.warn(`[community-standing] ${name} unavailable`, result.reason);
    }
  }

  return withAuthData(auth, {
    tab,
    page,
    history:
      historyResult.status === "fulfilled" ? historyResult.value.data : null,
    leaderboard:
      leaderboardResult.status === "fulfilled"
        ? leaderboardResult.value.data
        : null,
    tiers: tiersResult.status === "fulfilled" ? tiersResult.value.data : null,
  } satisfies CommunityStandingLoaderData);
}
