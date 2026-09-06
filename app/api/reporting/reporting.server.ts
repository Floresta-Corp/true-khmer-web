import {
  apiRequestWithOptionalSession,
  readOptional,
} from "~/lib/server/api-client.server";
import type { GetReportingTypesResponse } from "~/types/api-client";

export async function GetPublicReportType(request: Request) {
  return await apiRequestWithOptionalSession<GetReportingTypesResponse>(
    request,
    "/public/reporting-type",
    {
      method: "GET",
    },
  );
}

/**
 * Report reasons for the report dialogs. Every caller renders fine without
 * them — the dialog falls back to a free-text reason — so an outage here must
 * not take the forum or volunteer pages down with it.
 *
 * Shared because the forum list, forum detail and volunteer detail loaders all
 * need it; they each had their own copy of this wrapper.
 */
export async function getReportReasons(request: Request) {
  const result = await readOptional("report reasons", () =>
    GetPublicReportType(request),
  );
  return (result?.data as GetReportingTypesResponse | null) ?? null;
}
