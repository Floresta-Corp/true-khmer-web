import { apiRequestWithOptionalSession, apiRequestWithSession } from "~/lib/server/api-client.server";
import { SubmitReportInputSchema, type SubmitReportInput } from "~/features/forum/types";

export async function GetPublicReportType(request: Request) {
    return await apiRequestWithOptionalSession(request, '/forum/public/reporting-type', {
        method: 'GET',
    })
}

export async function SubmitReport(request: Request, input: SubmitReportInput) {
    const body = SubmitReportInputSchema.parse(input);
    return await apiRequestWithSession(request, '/forum/reporting', {
        method: 'POST',
        body,
    })
}