import * as z from "zod";

export const ReportingTypeSchema = z.object({
  id: z.string(),
  type: z.string(),
});
export type ReportingType = z.infer<typeof ReportingTypeSchema>;

export const GetPublicReportTypeSchema = z.object({
  ok: z.boolean(),
  reportingTypes: z.array(ReportingTypeSchema),
});
export type GetPublicReportType = z.infer<typeof GetPublicReportTypeSchema>;

export const SubmitReportInputSchema = z.object({
  questionId: z.string().optional(),
  answerId: z.string().optional(),
  typeId: z.string(),
  description: z.string(),
});
export type SubmitReportInput = z.infer<typeof SubmitReportInputSchema>;
