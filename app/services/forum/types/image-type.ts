import * as z from "zod";

export const ForumQuestionImagePresignInputSchema = z.object({
  contentType: z.string(),
  fileSize: z.number(),
});

export type ForumQuestionImagePresignInput = z.infer<
  typeof ForumQuestionImagePresignInputSchema
>;

export const ForumQuestionImagePresignUploadSchema = z.object({
  uploadUrl: z.string(),
  method: z.literal("PUT"),
  requiredHeaders: z.object({
    "Content-Length": z.string(),
    "Content-Type": z.string(),
  }),
  imageKey: z.string(),
  expiresInSeconds: z.number(),
});

export const ForumQuestionImagePresignResponseSchema = z.object({
  ok: z.boolean(),
  upload: ForumQuestionImagePresignUploadSchema,
});

export type ForumQuestionImagePresignResponse = z.infer<
  typeof ForumQuestionImagePresignResponseSchema
>;
