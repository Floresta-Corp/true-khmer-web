import { z } from "zod";

export const ProfileUserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  displayName: z.string().nullable(),
  occupation: z.string().nullable(),
  email: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  telegramUsername: z.string().nullable(),
});
export type ProfileUser = z.infer<typeof ProfileUserSchema>;

export const ProfileCountrySchema = z.object({
  id: z.string(),
  name: z.string(),
  iso2: z.string().nullable(),
});
export type ProfileCountry = z.infer<typeof ProfileCountrySchema>;

export const ProfileCitySchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type ProfileCity = z.infer<typeof ProfileCitySchema>;

export const ProfileDetailSchema = z.object({
  avatarKey: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  bio: z.string().nullable(),
  country: ProfileCountrySchema,
  city: ProfileCitySchema,
});
export type ProfileDetail = z.infer<typeof ProfileDetailSchema>;

export const ProfileSkillSchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type ProfileSkill = z.infer<typeof ProfileSkillSchema>;

export const ProfileSocialLinksSchema = z.object({
  website: z.string().nullable(),
  linkedin: z.string().nullable(),
  twitter: z.string().nullable(),
  facebook: z.string().nullable(),
});
export type ProfileSocialLinks = z.infer<typeof ProfileSocialLinksSchema>;

export const ProfileTierSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  rankOrder: z.number(),
  minPoints: z.number(),
});
export type ProfileTier = z.infer<typeof ProfileTierSchema>;

export const ProfilePostedCountsSchema = z.object({
  forum: z.number(),
  volunteer: z.number(),
  project: z.number(),
});
export type ProfilePostedCounts = z.infer<typeof ProfilePostedCountsSchema>;

export const ProfileByIdSchema = z.object({
  user: ProfileUserSchema,
  profile: ProfileDetailSchema,
  skills: z.array(ProfileSkillSchema),
  socialLinks: ProfileSocialLinksSchema,
  tier: ProfileTierSchema,
  postedCounts: ProfilePostedCountsSchema,
});
export type ProfileById = z.infer<typeof ProfileByIdSchema>;

export const GetProfileByIdResponseSchema = z.object({
  ok: z.literal(true),
  profile: ProfileByIdSchema,
});
export type GetProfileByIdResponse = z.infer<
  typeof GetProfileByIdResponseSchema
>;
