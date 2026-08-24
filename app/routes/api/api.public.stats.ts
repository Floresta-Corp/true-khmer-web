import { getPublicStats } from "~/api/public/stats/stats.server";
import type { PublicStatsResult } from "~/routes/auth/domain/public-stats.types";

export async function loader({ request }: { request: Request }) {
  try {
    return (await getPublicStats(request)) satisfies PublicStatsResult;
  } catch (err) {
    console.error("[api/public/stats] loader", err);
    return {
      ok: false,
      error: "Failed to load platform stats",
    } satisfies PublicStatsResult;
  }
}
