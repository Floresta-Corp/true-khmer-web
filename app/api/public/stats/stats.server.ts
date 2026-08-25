import { apiRequestPublic } from "~/lib/server/api-client.server";
import type { PublicStatsResult } from "~/routes/auth/domain/public-stats.types";

export async function getPublicStats(request: Request) {
  const result = await apiRequestPublic<PublicStatsResult>(
    request,
    "/public/stats",
    { method: "GET" },
  );

  return result.data;
}
