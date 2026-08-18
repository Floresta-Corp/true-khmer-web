import {
  apiRequestWithOptionalSession,
  apiRequestWithSession,
} from "~/lib/server/api-client.server";
import {
  SubmitReportInputSchema,
  type SubmitReportInput,
} from "~/features/forum/types";
import type {
  CreateReportingResponse,
  GetReportingTypesResponse,
} from "~/types/api-client";

export async function GetPublicReportType(request: Request) {
  return await apiRequestWithOptionalSession<GetReportingTypesResponse>(
    request,
    "/public/reporting-type",
    {
      method: "GET",
    },
  );
}

export async function SubmitReport(request: Request, input: SubmitReportInput) {
  const body = SubmitReportInputSchema.parse(input);
  return await apiRequestWithSession<CreateReportingResponse>(
    request,
    "/forum/reporting",
    {
      method: "POST",
      body,
    },
  );
}
