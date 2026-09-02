import { z } from "zod";

export const BasicJoinSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type BasicJoinType = z.infer<typeof BasicJoinSchema>;

export const VoteIntentSchema = z.enum(["UPVOTE", "DOWNVOTE", "NONE"]);
export type VoteIntent = z.infer<typeof VoteIntentSchema>;

export const ViewerVoteSchema = VoteIntentSchema;
export const ViewerVote = ViewerVoteSchema.enum;
export type ViewerVote = z.infer<typeof ViewerVoteSchema>;

export const PaginationSchema = z.object({
  limit: z.number(),
  hasMore: z.boolean(),
  nextCursor: z.string().nullable(),
  /** Total matching records for the active filters. Not sent by every paginated endpoint. */
  total: z.number().optional(),
});
export type Pagination = z.infer<typeof PaginationSchema>;

export const FileInputSchema = z.object({
  contentType: z.string(),
  fileSize: z.number(),
});

export type FileInput = z.infer<typeof FileInputSchema>;

export const RequiredHeadersSchema = z.object({
  "Content-Length": z.string(),
  "Content-Type": z.string(),
});
export type RequiredHeaders = z.infer<typeof RequiredHeadersSchema>;

export const UploadSchema = z.object({
  uploadUrl: z.string(),
  method: z.string(),
  requiredHeaders: RequiredHeadersSchema,
  avatarKey: z.string(),
  expiresInSeconds: z.number(),
});
export type Upload = z.infer<typeof UploadSchema>;

export const UploadAvatarPresignResponseSchema = z.object({
  ok: z.boolean(),
  upload: UploadSchema,
});
export type UploadAvatarPresignResponse = z.infer<
  typeof UploadAvatarPresignResponseSchema
>;
