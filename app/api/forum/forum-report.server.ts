import { apiRequestWithSession } from "~/lib/server/api-client.server";
import {
  SubmitReportInputSchema,
  type SubmitReportInput,
} from "~/features/forum/types";
import type { CreateReportingResponse } from "~/types/api-client";
export { GetPublicReportType } from "~/api/reporting";

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
