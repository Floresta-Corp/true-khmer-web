import * as z from "zod";

const RoleSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  capacity: z.number(),
});

const CreatorSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarKey: z.string().nullable(),
  launchpadCount: z.number(),
});

const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

const CitySchema = z.object({
  id: z.string(),
  name: z.string(),
});

const dateStringSchema = z.string().refine(
  (value) => {
    const date = new Date(value);
    return !isNaN(date.getTime());
  },
  {
    message: "Invalid date format",
  }
);

export const LaunchpadOpportunitySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  deadline: dateStringSchema,
  logoKey: z.string().nullable(),
  coverKey: z.string().nullable(),
  documentKeys: z.array(z.string()),
  phoneNumber: z.string().nullable(),
  email: z.string().nullable(),
  telegramUsername: z.string().nullable(),
  totalView: z.number(),
  createdBy: CreatorSchema,
  createdAt: dateStringSchema,
  category: CategorySchema,
  city: CitySchema,
  totalRoles: z.number(),
});

export type LaunchpadOpportunity = z.infer<typeof LaunchpadOpportunitySchema>;

export const LaunchpadDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: CategorySchema,
  city: CitySchema,
  description: z.string(),
  deadline: dateStringSchema,
  logoKey: z.string().nullable(),
  coverKey: z.string().nullable(),
  documentKeys: z.array(z.string()),
  phoneNumber: z.string().nullable(),
  email: z.string().nullable(),
  telegramUsername: z.string().nullable(),
  totalView: z.number(),
  totalRoles: z.number(),
  createdBy: CreatorSchema,
  createdAt: dateStringSchema,
  roles: z.array(RoleSchema),
});

export type LaunchpadDetail = z.infer<typeof LaunchpadDetailSchema>;

export const GetLaunchpadResponseSchema = z.object({
  ok: z.boolean(),
  launchpads: z.array(LaunchpadOpportunitySchema),
  nextCursor: z.string().nullable(),
});

export type GetLaunchpadResponse = z.infer<typeof GetLaunchpadResponseSchema>;

export const GetLaunchpadDetailResponseSchema = z.object({
  ok: z.boolean(),
  launchpad: LaunchpadDetailSchema,
});

export type GetLaunchpadDetailResponse = z.infer<typeof GetLaunchpadDetailResponseSchema>;
