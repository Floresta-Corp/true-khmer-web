import { apiRequestWithOptionalSession } from "~/lib/server/api-client.server";
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
