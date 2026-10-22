import type { Route } from "project-types/myspace/route/+types/community-standing";
import {
  StandingTabSchema,
  type GetLeaderboardResponse,
  type GetPointsHistoryResponse,
  type GetTiersResponse,
  type StandingTab,
} from "~/features/myspace/types";
import {
  AuthSessionExpiredError,
  readOptional,
} from "~/lib/server/api-client.server";
import {
  clearAndRedirectToLogin,
  requestWithSetCookie,
  requireUser,
} from "~/lib/server/route-guards.server";
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

/**
 * Each section degrades to "unavailable" on its own when its endpoint is
 * missing or failing (404/5xx). Auth failures and redirects still escape, so an
 * expired session lands on the login page instead of three empty panels.
 */
async function loadStanding(apiRequest: Request, page: number) {
  return Promise.all([
    readOptional("points history", () =>
      GetPointsHistory(apiRequest, {
        limit: POINTS_HISTORY_PAGE_SIZE,
        offset: (page - 1) * POINTS_HISTORY_PAGE_SIZE,
      }),
    ),
    readOptional("leaderboard", () => GetLeaderboard(apiRequest)),
    readOptional("tiers", () => GetTiers(apiRequest)),
  ]);
}

export async function communityStandingLoader({ request }: Route.LoaderArgs) {
  const auth = await requireUser(request);
  const url = new URL(request.url);
  const tab = StandingTabSchema.catch("points").parse(
    url.searchParams.get("tab"),
  );
  const page = Math.max(
    Math.trunc(Number(url.searchParams.get("page"))) || 1,
    1,
  );

  // The guard may have just refreshed the session; read with those tokens, not
  // the stale cookie, so refresh-token rotation cannot reject the reads below.
  const apiRequest = requestWithSetCookie(request, auth.setCookie);

  let results: Awaited<ReturnType<typeof loadStanding>>;
  try {
    results = await loadStanding(apiRequest, page);
  } catch (error) {
    if (error instanceof AuthSessionExpiredError) {
      throw await clearAndRedirectToLogin(
        request,
        `${url.pathname}${url.search}`,
      );
    }
    throw error;
  }

  const [historyResult, leaderboardResult, tiersResult] = results;

  // A read that refreshed the session again carries the newest cookie; fall
  // back to the guard's so a refresh it made still reaches the browser.
  const setCookie =
    results.find((result) => result?.setCookie)?.setCookie ?? auth.setCookie;

  return withAuthData({ setCookie }, {
    tab,
    page,
    history: historyResult?.data ?? null,
    leaderboard: leaderboardResult?.data ?? null,
    tiers: tiersResult?.data ?? null,
  } satisfies CommunityStandingLoaderData);
}
