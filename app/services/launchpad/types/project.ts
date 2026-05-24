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

export const LaunchpadOpportunitySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  deadline: z.string().date(),
  logoKey: z.string().nullable(),
  coverKey: z.string().nullable(),
  documentKeys: z.array(z.string()),
  documentNames: z.array(z.string()).default([]),
  phoneNumber: z.string().nullable(),
  email: z.string().nullable(),
  telegramUsername: z.string().nullable(),
  totalView: z.number(),
  createdBy: CreatorSchema,
  createdAt: z.string().datetime(),
  category: CategorySchema,
  city: CitySchema,
  totalRoles: z.number(),
  isSaved: z.boolean().default(false),
  savedAt: z.coerce.date(),
});

export type LaunchpadOpportunity = z.infer<typeof LaunchpadOpportunitySchema>;

export const LaunchpadDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: CategorySchema,
  city: CitySchema,
  description: z.string(),
  deadline: z.string().date(),
  logoKey: z.string().nullable(),
  coverKey: z.string().nullable(),
  documentKeys: z.array(z.string()),
  documentNames: z.array(z.string()).default([]),
  phoneNumber: z.string().nullable(),
  email: z.string().nullable(),
  telegramUsername: z.string().nullable(),
  totalView: z.number(),
  totalRoles: z.number(),
  createdBy: CreatorSchema,
  createdAt: z.string().datetime(),
  roles: z.array(RoleSchema),
});

export type LaunchpadDetail = z.infer<typeof LaunchpadDetailSchema>;

export const GetLaunchpadResponseSchema = z.object({
  ok: z.boolean(),
  launchpads: z.array(LaunchpadOpportunitySchema),
  nextCursor: z.string().nullable(),
  cities: z.array(CitySchema).optional(),
});

export type GetLaunchpadResponse = z.infer<typeof GetLaunchpadResponseSchema>;

export const GetLaunchpadDetailResponseSchema = z.object({
  ok: z.boolean(),
  launchpad: LaunchpadDetailSchema,
});

export type GetLaunchpadDetailResponse = z.infer<
  typeof GetLaunchpadDetailResponseSchema
>;
