import type { PublicStatsResponse } from "~/types/api-client";

export type PublicStats = PublicStatsResponse["stats"];

export type PublicStatsResult =
  | PublicStatsResponse
  | { ok: false; error: string };
