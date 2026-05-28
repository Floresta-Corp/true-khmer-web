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

export const MyApplicationSourceTypeSchema = z.enum([
  "volunteer",
  "project",
  "projects",
]);
export type MyApplicationSourceType = z.infer<
  typeof MyApplicationSourceTypeSchema
>;

export const MyApplicationStatusActionSchema = z.enum([
  "confirm",
  "decline",
  "withdraw",
]);
export type MyApplicationStatusAction = z.infer<
  typeof MyApplicationStatusActionSchema
>;

export const MyApplicationArchiveActionSchema = z.enum([
  "archive",
  "unarchive",
]);
export type MyApplicationArchiveAction = z.infer<
  typeof MyApplicationArchiveActionSchema
>;

export const OpportunityDetailSchema = z.object({
  id: z.string(),
  title: z.string(),
  overview: z.string().nullable(),
  category: CategorySchema,
  location: CategorySchema,
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  commitmentLabel: z.string().nullable(),
  commitmentDescription: z.string().nullable(),
  filled: z.boolean(),
  impactRewardPoints: z.number().int().nullable(),
});
export type OpportunityDetail = z.infer<typeof OpportunityDetailSchema>;

export const OwnerContactSchema = z.object({
  email: z.string(),
  phoneNumber: z.string().nullable(),
  telegramUsername: z.string().nullable(),
});
export type OwnerContact = z.infer<typeof OwnerContactSchema>;

export const OwnerSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.string().nullable(),
  avatarKey: z.string().nullable(),
  postedCount: z.number().int(),
  contact: OwnerContactSchema,
});
export type Owner = z.infer<typeof OwnerSchema>;

export const RoleSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  responsibilities: z.array(z.string()),
  requirements: z.array(z.string()),
});
export type Role = z.infer<typeof RoleSchema>;

export const TimelineDeclinedSchema = z.object({
  at: z.string().nullable(),
  by: z.string(),
});
export type TimelineDeclined = z.infer<typeof TimelineDeclinedSchema>;

export const TimelineSchema = z.object({
  submitted: z.string().nullable(),
  underReview: z.string().nullable(),
  passed: z.string().nullable(),
  declined: TimelineDeclinedSchema,
  confirmed: z.string().nullable(),
  completed: z.string().nullable(),
});
export type Timeline = z.infer<typeof TimelineSchema>;

export const ApplicationDetailSchema = z.object({
  id: z.string(),
  sourceType: z.string(),
  title: z.string(),
  imageKey: z.null(),
  status: z.string(),
  appliedAt: z.string(),
  deadline: z.null(),
  archived: z.boolean(),
  opportunity: OpportunityDetailSchema,
  role: RoleSchema,
  owner: OwnerSchema,
  timeline: TimelineSchema,
});
export type ApplicationDetail = z.infer<typeof ApplicationDetailSchema>;

export const GetMyApplicationDetailResponseSchema = z.object({
  ok: z.boolean(),
  application: ApplicationDetailSchema,
});
export type GetMyApplicationDetailResponse = z.infer<
  typeof GetMyApplicationDetailResponseSchema
>;

export type ApplicationSourceType = MyApplicationSourceType;
export type ApplicationStatusAction = MyApplicationStatusAction;
export type ApplicationArchiveAction = MyApplicationArchiveAction;
