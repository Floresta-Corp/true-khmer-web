import * as z from "zod";

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type Category = z.infer<typeof CategorySchema>;

export const OpportunitySchema = z.object({
  id: z.string(),
  title: z.string(),
});
export type Opportunity = z.infer<typeof OpportunitySchema>;

export const SummarySchema = z.object({
  PENDING: z.number(),
  APPROVED: z.number(),
  DECLINED: z.number(),
  ACTIVE: z.number(),
  COMPLETED: z.number(),
  WITHDRAWN: z.number(),
  ARCHIVED: z.number(),
});
export type Summary = z.infer<typeof SummarySchema>;

export const ApplicationSchema = z.object({
  id: z.string(),
  sourceType: z.string(),
  title: z.string(),
  imageKey: z.null(),
  appliedAt: z.string(),
  deadline: z.null(),
  status: z.string(),
  opportunity: OpportunitySchema,
  category: CategorySchema,
  location: CategorySchema,
});
export type Application = z.infer<typeof ApplicationSchema>;

export const GetMyApplicationResponseSchema = z.object({
  ok: z.boolean(),
  applications: z.array(ApplicationSchema),
  summary: SummarySchema,
});
export type GetMyApplicationResponse = z.infer<
  typeof GetMyApplicationResponseSchema
>;

export type ApplicationStatusAction = "confirm" | "decline" | "withdraw";
export type ApplicationArchiveAction = "archive" | "unarchive";
