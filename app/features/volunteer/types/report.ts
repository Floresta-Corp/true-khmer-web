import * as z from "zod";

export const REPORT_DESCRIPTION_MAX_LENGTH = 10000;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const SubmitVolunteerReportInputSchema = z.object({
  opportunityId: z.string().regex(UUID_REGEX, "Invalid opportunity."),
  typeId: z.string().regex(UUID_REGEX, "Invalid report type selected."),
  description: z.string().max(REPORT_DESCRIPTION_MAX_LENGTH).optional(),
});
export type SubmitVolunteerReportInput = z.infer<
  typeof SubmitVolunteerReportInputSchema
>;
