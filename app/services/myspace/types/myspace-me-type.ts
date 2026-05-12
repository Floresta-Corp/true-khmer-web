import { z } from "zod";

export const VisibilitySchema = z.object({
  profile: z.string(),
  contact: z.string(),
  socialLinks: z.string(),
  contributions: z.string(),
});
export type Visibility = z.infer<typeof VisibilitySchema>;

export const SocialLinksSchema = z.object({
  website: z.string().nullable(),
  linkedin: z.string().nullable(),
  twitter: z.string().nullable(),
  facebook: z.string().nullable(),
});
export type SocialLinks = z.infer<typeof SocialLinksSchema>;

export const TierSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  rankOrder: z.number(),
  minPoints: z.number(),
});
export type Tier = z.infer<typeof TierSchema>;

export const ProgressSchema = z.object({
  totalPoints: z.number(),
  rank: z.string().nullable(),
  tier: TierSchema,
});
export type Progress = z.infer<typeof ProgressSchema>;

export const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type Skill = z.infer<typeof SkillSchema>;

export const CountrySchema = z.object({
  id: z.string(),
  name: z.string(),
  iso2: z.string().nullable(),
});
export type Country = z.infer<typeof CountrySchema>;

export const CitySchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type City = z.infer<typeof CitySchema>;

export const ProfileInfoSchema = z.object({
  avatarKey: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  bio: z.string().nullable(),
  country: CountrySchema.nullable(),
  city: CitySchema.nullable(),
  visibility: VisibilitySchema,
});
export type ProfileInfo = z.infer<typeof ProfileInfoSchema>;

export const UserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  displayName: z.string().nullable(),
  email: z.string(),
  gender: z.string(),
  dateOfBirth: z.string().nullable(),
  occupation: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  telegramUsername: z.string().nullable(),
});
export type User = z.infer<typeof UserSchema>;

export const ProfileSchema = z.object({
  user: UserSchema,
  profile: ProfileInfoSchema,
  skills: z.array(SkillSchema),
  socialLinks: SocialLinksSchema,
  progress: ProgressSchema,
});
export type Profile = z.infer<typeof ProfileSchema>;

export const GetMySpaceMeResponseSchema = z.object({
  ok: z.boolean(),
  profile: ProfileSchema,
});
export type GetMySpaceMeResponse = z.infer<typeof GetMySpaceMeResponseSchema>;

export type RecentActivityType =
  | "forum_question_posted"
  | "forum_question_deleted"
  | "forum_question_upvoted"
  | "forum_question_downvoted"
  | "forum_question_saved"
  | "forum_answer_posted"
  | "forum_answer_deleted"
  | "forum_answer_upvoted"
  | "forum_answer_downvoted"
  | "forum_best_answer_marked"
  | "volunteer_opportunity_posted"
  | "volunteer_opportunity_saved"
  | "volunteer_application_submitted"
  | "launchpad_created";

export const RecentActivitySchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum([
    "forum_question_posted",
    "forum_question_deleted",
    "forum_question_upvoted",
    "forum_question_downvoted",
    "forum_question_saved",
    "forum_answer_posted",
    "forum_answer_deleted",
    "forum_answer_upvoted",
    "forum_answer_downvoted",
    "forum_best_answer_marked",
    "volunteer_opportunity_posted",
    "volunteer_opportunity_saved",
    "volunteer_application_submitted",
    "launchpad_created",
  ]),
  title: z.string(),
  description: z.string().nullable(),
  targetType: z.string(),
  targetId: z.string(),
  referenceType: z.string(),
  referenceId: z.string(),
  data: z.record(z.string(), z.unknown()),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type RecentActivity = z.infer<typeof RecentActivitySchema>;

export const GetRecentActivityResponseSchema = z.object({
  ok: z.boolean(),
  activities: z.array(RecentActivitySchema),
});
export type GetRecentActivityResponse = z.infer<
  typeof GetRecentActivityResponseSchema
>;

export const UpdateMySpaceInputSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  gender: z.string(),
  dateOfBirth: z.string().nullable(),
  occupation: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  telegramUsername: z.string().nullable(),
  bio: z.string().nullable(),
  countryId: z.string().nullable(),
  cityId: z.string().nullable(),
  avatarKey: z.string().nullable(),
  skills: z.array(z.string()),
  socialLinks: SocialLinksSchema,
  visibility: VisibilitySchema,
});
export type UpdateMySpaceInput = z.infer<typeof UpdateMySpaceInputSchema>;

export const UpdateMySpaceResponseSchema = z.object({
  ok: z.boolean(),
  profile: ProfileSchema,
});
export type UpdateMySpaceResponse = z.infer<typeof UpdateMySpaceResponseSchema>;
