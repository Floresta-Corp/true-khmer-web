import * as z from "zod";

export const MyApplicationReferenceSchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type MyApplicationReference = z.infer<
  typeof MyApplicationReferenceSchema
>;

export const MyApplicationStatusGroupSchema = z.enum([
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
  "DECLINED",
  "CONFIRMED",
  "COMPLETED",
  "WITHDRAWN",
]);
export type MyApplicationStatusGroup = z.infer<
  typeof MyApplicationStatusGroupSchema
>;

export const MyApplicationRoleSchema = z.object({
  applicationId: z.string(),
  roleId: z.string(),
  title: z.string(),
  status: MyApplicationStatusGroupSchema,
  appliedAt: z.string(),
});
export type MyApplicationRole = z.infer<typeof MyApplicationRoleSchema>;

export const MyApplicationItemSchema = z.object({
  opportunityId: z.string(),
  opportunityTitle: z.string(),
  sourceType: z.enum(["VOLUNTEER", "PROJECT"]),
  imageKey: z.string().nullable(),
  appliedAt: z.string(),
  deadline: z.string().nullable(),
  status: MyApplicationStatusGroupSchema,
  needAttention: z.boolean(),
  totalRoleApplied: z.number().int().nonnegative(),
  filled: z.boolean(),
  category: MyApplicationReferenceSchema.nullable(),
  location: MyApplicationReferenceSchema.nullable(),
  roles: z.array(MyApplicationRoleSchema),
  approvedRole: MyApplicationRoleSchema.nullable(),
});
export type MyApplicationItem = z.infer<typeof MyApplicationItemSchema>;

export const MyApplicationsSummarySchema = z.object({
  PENDING: z.number().int().nonnegative(),
  APPROVED: z.number().int().nonnegative(),
  DECLINED: z.number().int().nonnegative(),
  ACTIVE: z.number().int().nonnegative(),
  COMPLETED: z.number().int().nonnegative(),
  WITHDRAWN: z.number().int().nonnegative(),
  ARCHIVED: z.number().int().nonnegative(),
});
export type MyApplicationsSummary = z.infer<
  typeof MyApplicationsSummarySchema
>;

export const GetMyApplicationResponseSchema = z.object({
  ok: z.literal(true),
  applications: z.array(MyApplicationItemSchema).nullable(),
  summary: MyApplicationsSummarySchema,
});
export type GetMyApplicationResponse = z.infer<
  typeof GetMyApplicationResponseSchema
>;

export const MyApplicationListTypeSchema = z.enum([
  "all",
  "volunteer",
  "projects",
]);
export type MyApplicationListType = z.infer<
  typeof MyApplicationListTypeSchema
>;

export const MyApplicationFilterSchema = z.enum([
  "all",
  "pending",
  "approved",
  "active",
  "completed",
  "archived",
]);
export type MyApplicationFilter = z.infer<typeof MyApplicationFilterSchema>;

export const MyApplicationRequestSourceTypeSchema = z.enum([
  "volunteer",
  "projects",
]);
export type MyApplicationRequestSourceType = z.infer<
  typeof MyApplicationRequestSourceTypeSchema
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

export const MyApplicationTimelineSchema = z.object({
  submitted: z.string().nullable(),
  underReview: z.string().nullable(),
  approved: z.string().nullable(),
  declined: z.object({
    at: z.string().nullable(),
    by: z.enum(["POSTER", "APPLICANT", "SYSTEM"]).nullable(),
  }),
  confirmed: z.string().nullable(),
  completed: z.string().nullable(),
});
export type MyApplicationTimeline = z.infer<
  typeof MyApplicationTimelineSchema
>;

export const MyApplicationRoleDetailSchema = z.object({
  applicationId: z.string(),
  roleId: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  responsibilities: z.array(z.string()),
  requirements: z.array(z.string()),
  status: MyApplicationStatusGroupSchema,
  appliedAt: z.string(),
  archived: z.boolean(),
  actions: z.object({
    canConfirm: z.boolean(),
    canDecline: z.boolean(),
    canWithdraw: z.boolean(),
  }),
  timeline: MyApplicationTimelineSchema,
});
export type MyApplicationRoleDetail = z.infer<
  typeof MyApplicationRoleDetailSchema
>;

export const MyApplicationDetailSchema = z.object({
  id: z.string(),
  sourceType: z.enum(["VOLUNTEER", "PROJECT"]),
  title: z.string(),
  imageKey: z.string().nullable(),
  status: MyApplicationStatusGroupSchema,
  appliedAt: z.string(),
  deadline: z.string().nullable(),
  archived: z.boolean(),
  needAttention: z.boolean(),
  totalRoleApplied: z.number().int().nonnegative(),
  canArchive: z.boolean(),
  opportunity: z.object({
    id: z.string(),
    title: z.string(),
    overview: z.string().nullable(),
    category: MyApplicationReferenceSchema.nullable(),
    location: MyApplicationReferenceSchema.nullable(),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
    commitmentLabel: z.string().nullable(),
    commitmentDescription: z.string().nullable(),
    filled: z.boolean(),
    impactRewardPoints: z.number().int().nonnegative().nullable(),
  }),
  owner: z.object({
    id: z.string(),
    name: z.string(),
    avatarUrl: z.string().nullable(),
    avatarKey: z.string().nullable(),
    postedCount: z.number().int().nonnegative(),
    contact: z.object({
      email: z.string(),
      phoneNumber: z.string().nullable(),
      telegramUsername: z.string().nullable(),
    }),
  }),
  roles: z.array(MyApplicationRoleDetailSchema),
  approvedRole: MyApplicationRoleSchema.nullable(),
});
export type MyApplicationDetail = z.infer<typeof MyApplicationDetailSchema>;

export const GetMyApplicationDetailResponseSchema = z.object({
  ok: z.literal(true),
  application: MyApplicationDetailSchema,
});
export type GetMyApplicationDetailResponse = z.infer<
  typeof GetMyApplicationDetailResponseSchema
>;

export const MyApplicationStatusActionResponseSchema = z.object({
  ok: z.literal(true),
  application: MyApplicationItemSchema,
});
export type MyApplicationStatusActionResponse = z.infer<
  typeof MyApplicationStatusActionResponseSchema
>;

export const MyApplicationArchiveActionResponseSchema = z.object({
  ok: z.literal(true),
  application: MyApplicationItemSchema.extend({
    archived: z.boolean(),
  }),
});
export type MyApplicationArchiveActionResponse = z.infer<
  typeof MyApplicationArchiveActionResponseSchema
>;

export const MyApplicationsErrorResponseSchema = z.object({
  ok: z.literal(false),
  error: z.string(),
});
export type MyApplicationsErrorResponse = z.infer<
  typeof MyApplicationsErrorResponseSchema
>;

export type MyApplicationSourceType = MyApplicationRequestSourceType;
export type ApplicationSourceType = MyApplicationRequestSourceType;
export type ApplicationStatusAction = MyApplicationStatusAction;
export type ApplicationArchiveAction = MyApplicationArchiveAction;

export type Application = MyApplicationItem;
export type ApplicationGroup = MyApplicationItem;
export type ApplicationRoleSummary = MyApplicationRole;
export type ApplicationDetail = MyApplicationDetail;
export type ApplicationDetailRole = MyApplicationRoleDetail;
export type Summary = MyApplicationsSummary;
export type Timeline = MyApplicationTimeline;
