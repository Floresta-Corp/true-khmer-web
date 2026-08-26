import { z } from "zod";
import { OpportunitySchema } from "~/features/volunteer/types";
import { LaunchpadOpportunitySchema } from "~/features/launchpad/types";

export const ProfileUserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  displayName: z.string().nullable(),
  occupation: z.string().nullable(),
  email: z.string().nullable(),
  phone: z
    .object({ country: z.string(), nationalNumber: z.string() })
    .nullable(),
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
  bio: z.string().nullable(),
  country: ProfileCountrySchema.nullable(),
  city: ProfileCitySchema.nullable(),
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
  tier: ProfileTierSchema.nullable(),
  postedCounts: ProfilePostedCountsSchema.nullable(),
});
export const GetProfileByIdResponseSchema = z.object({
  ok: z.literal(true),
  profile: ProfileByIdSchema,
});
export type GetProfileByIdResponse = z.infer<
  typeof GetProfileByIdResponseSchema
>;

// Forum Question Schema
export const TagsSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
  }),
);
export type Tags = z.infer<typeof TagsSchema>;

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type Category = z.infer<typeof CategorySchema>;

export const ForumAuthorSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarKey: z.string().nullable(),
});
export type ForumAuthor = z.infer<typeof ForumAuthorSchema>;

export const ForumQuestionSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  imageKey: z.string().nullable(),
  status: z.enum(["PUBLISHED", "DELETED"]),
  upvoteCount: z.number(),
  downvoteCount: z.number(),
  answerCount: z.number(),
  viewCount: z.number(),
  bestAnswerId: z.string().nullable(),
  bestAnswerSelectedAt: z.string().nullable(),
  score: z.number(),
  viewerVote: z.enum(["UPVOTE", "DOWNVOTE"]),
  viewerSave: z.boolean(),
  category: CategorySchema,
  author: ForumAuthorSchema,
  tags: TagsSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type ForumQuestion = z.infer<typeof ForumQuestionSchema>;

export const PaginationSchema = z.object({
  limit: z.number(),
  hasMore: z.boolean(),
  nextCursor: z.string().nullable(),
  total: z.number(),
});
export type Pagination = z.infer<typeof PaginationSchema>;

export const PostedContentSourceTypeSchema = z.enum([
  "forum",
  "volunteer",
  "project",
]);

export const ForumPostedContentSchema = z.object({
  ok: z.literal(true),
  sourceType: z.literal("forum"),
  questions: z.array(ForumQuestionSchema),
  pagination: PaginationSchema,
});

export const VolunteerPostedContentSchema = z.object({
  ok: z.literal(true),
  sourceType: z.literal("volunteer"),
  opportunities: z.array(OpportunitySchema),
  pagination: PaginationSchema,
});

export const ProjectPostedContentSchema = z.object({
  ok: z.literal(true),
  sourceType: z.literal("project"),
  launchpads: z.array(LaunchpadOpportunitySchema),
  nextCursor: z.string().nullable(),
});

export const GetPostedContentResponseSchema = z.discriminatedUnion(
  "sourceType",
  [
    ForumPostedContentSchema,
    VolunteerPostedContentSchema,
    ProjectPostedContentSchema,
  ],
);
export type GetPostedContentResponse = z.infer<
  typeof GetPostedContentResponseSchema
>;
