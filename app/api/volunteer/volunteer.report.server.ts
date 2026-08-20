import {
  SubmitVolunteerReportInputSchema,
  type SubmitVolunteerReportInput,
} from "~/features/volunteer/types";
import { apiRequestWithSession } from "~/lib/server/api-client.server";
import type { CreateVolunteerReportingResponse } from "~/types/api-client";

export async function SubmitVolunteerReport(
  request: Request,
  input: SubmitVolunteerReportInput,
) {
  const body = SubmitVolunteerReportInputSchema.parse(input);
  return await apiRequestWithSession<CreateVolunteerReportingResponse>(
    request,
    "/volunteer/reporting",
    {
      method: "POST",
      body,
    },
  );
}
