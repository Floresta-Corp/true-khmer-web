import * as z from "zod";

export const SourceTypeSchema = z.enum(["PROJECT", "VOLUNTEER"]);
export type SourceType = z.infer<typeof SourceTypeSchema>;

export const StatusSchema = z.enum([
  // "ACTIVE",
  // "CLOSED",
  // "COMPLETED",
  // "DRAFT",
  // "PUBLISHED",

  "DRAFT",
  "CANCELED",
  "FILLED",
  "COMPLETED",
  "IN_PROGRESS",
  "LIVE",
]);
export type ManagePostStatus = z.infer<typeof StatusSchema>;

export const PostingTypeSchema = z.enum(["all", "projects", "volunteer"]);
export type PostingType = z.infer<typeof PostingTypeSchema>;

export const PostingFilterSchema = z.enum([
  // "all",
  // "active",
  // "draft",
  // "closed",
  // "completed",
  // "published",

  "all",
  "live",
  "draft",
  "in_progress",
  "canceled",
  "completed",
  "filled",
]);
export type PostingFilter = z.infer<typeof PostingFilterSchema>;

export const PaginationSchema = z.object({
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  limit: z.number(),
  page: z.number(),
  total: z.number(),
  totalPages: z.number(),
});
export type ManagePostPagination = z.infer<typeof PaginationSchema>;

export const ManagePostSchema = z.object({
  applicantCount: z.number(),
  capacity: z.number(),
  createdAt: z.string(),
  deadline: z.union([z.null(), z.string()]),
  description: z.union([z.null(), z.string()]),
  filled: z.boolean(),
  id: z.string(),
  imageKey: z.union([z.null(), z.string()]),
  sourceType: SourceTypeSchema,
  status: StatusSchema,
  title: z.string(),
  views: z.number(),
});
export type ManagePost = z.infer<typeof ManagePostSchema>;

export const ManagePostResponseSchema = z.object({
  ok: z.boolean(),
  pagination: PaginationSchema,
  postings: z.array(ManagePostSchema),
});
export type ManagePostResponse = z.infer<typeof ManagePostResponseSchema>;
