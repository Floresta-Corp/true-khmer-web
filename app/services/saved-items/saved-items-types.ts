import * as z from "zod";
import { QuestionSchema } from "../forum/types";
import { PaginationSchema } from "../types";
import { OpportunitySchema } from "../volunteer/types";
import { LaunchpadOpportunitySchema } from "../launchpad/types";
export const getSaveForumQuestionSchema = z.object({
  ok: z.boolean(),
  questions: z.array(QuestionSchema),
  pagination: PaginationSchema,
});
export type GetSaveForumQuestionResponse = z.infer<
  typeof getSaveForumQuestionSchema
>;

export const GetSavedVolunteerOpportunitiesSchema = z.object({
  ok: z.boolean(),
  opportunities: z.array(OpportunitySchema),
  pagination: PaginationSchema,
});
export type GetSavedVolunteerOpportunitiesResponse = z.infer<
  typeof GetSavedVolunteerOpportunitiesSchema
>;

export const GetSavedLaunchpadOpportunitiesSchema = z.object({
  ok: z.boolean(),
  launchpads: z.array(LaunchpadOpportunitySchema),
  nextCursor: z.null(),
});
export type GetSavedLaunchpadOpportunitiesResponse = z.infer<
  typeof GetSavedLaunchpadOpportunitiesSchema
>;

export const StatusSchema = z.enum([
  "CANCELED",
  "CLOSED",
  "COMPLETED",
  "DELETED",
  "DRAFT",
  "IN_PROGRESS",
  "LIVE",
  "PUBLISHED",
]);
export type Status = z.infer<typeof StatusSchema>;

export const ViewerVoteSchema = z.enum(["DOWNVOTE", "UPVOTE"]);
export type ViewerVote = z.infer<typeof ViewerVoteSchema>;

export const FilterSavedItemSchema = z.enum(["forum", "project", "volunteer"]);
export type FilterSavedItem = z.infer<typeof FilterSavedItemSchema>;

export const AuthorSchema = z.object({
  avatarKey: z.union([z.null(), z.string()]),
  id: z.string(),
  name: z.string(),
});
export type Author = z.infer<typeof AuthorSchema>;

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type Category = z.infer<typeof CategorySchema>;

export const CitySchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type City = z.infer<typeof CitySchema>;

export const CreatedBySchema = z.object({
  avatarKey: z.union([z.null(), z.string()]),
  id: z.string(),
  launchpadCount: z.number(),
  name: z.string(),
});
export type CreatedBy = z.infer<typeof CreatedBySchema>;

export const LocationSchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type Location = z.infer<typeof LocationSchema>;

export const TagSchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type Tag = z.infer<typeof TagSchema>;

export const ItemItemSchema = z.object({
  category: CategorySchema.optional(),
  city: CitySchema.optional(),
  coverKey: z.union([z.null(), z.string()]).optional(),
  createdAt: z.string(),
  createdBy: CreatedBySchema.optional(),
  deadline: z.union([z.coerce.date(), z.null()]).optional(),
  description: z.union([z.null(), z.string()]).optional(),
  documentKeys: z.array(z.string()).optional(),
  documentNames: z.array(z.string()).optional(),
  email: z.union([z.null(), z.string()]).optional(),
  id: z.string(),
  isSaved: z.boolean().optional(),
  logoKey: z.union([z.null(), z.string()]).optional(),
  name: z.string().optional(),
  phoneNumber: z.union([z.null(), z.string()]).optional(),
  savedAt: z.coerce.date().optional(),
  status: StatusSchema.optional(),
  telegramUsername: z.union([z.null(), z.string()]).optional(),
  totalRoles: z.number().optional(),
  totalView: z.number().optional(),
  applicationCount: z.number().optional(),
  applicationDeadline: z.string().optional(),
  capacity: z.number().optional(),
  commitmentDescription: z.union([z.null(), z.string()]).optional(),
  commitmentLabel: z.union([z.null(), z.string()]).optional(),
  coverImageKey: z.string().optional(),
  endDate: z.union([z.null(), z.string()]).optional(),
  filled: z.boolean().optional(),
  location: LocationSchema.optional(),
  overview: z.string().optional(),
  startDate: z.union([z.null(), z.string()]).optional(),
  title: z.string().optional(),
  viewerSave: z.boolean().optional(),
  answerCount: z.number().optional(),
  author: AuthorSchema.optional(),
  bestAnswerId: z.union([z.null(), z.string()]).optional(),
  bestAnswerSelectedAt: z.union([z.coerce.date(), z.null()]).optional(),
  body: z.string().optional(),
  downvoteCount: z.number().optional(),
  imageKey: z.union([z.null(), z.string()]).optional(),
  score: z.number().optional(),
  tags: z.array(TagSchema).optional(),
  updatedAt: z.coerce.date().optional(),
  upvoteCount: z.number().optional(),
  viewerVote: z.union([ViewerVoteSchema, z.null()]).optional(),
});
export type ItemItem = z.infer<typeof ItemItemSchema>;

export const ItemElementSchema = z.object({
  item: ItemItemSchema,
  savedAt: z.coerce.date(),
  type: FilterSavedItemSchema,
});
export type ItemElement = z.infer<typeof ItemElementSchema>;

export const GetSavedItemsSchema = z.object({
  items: z.array(ItemElementSchema),
  ok: z.boolean(),
  pagination: PaginationSchema,
});
export type GetSavedItemsResponse = z.infer<typeof GetSavedItemsSchema>;
