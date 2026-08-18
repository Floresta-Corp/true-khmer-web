import { z } from "zod";

// ── Vote types ─────────────────────────────────────────────────────────────
export type VoteIntent = "UPVOTE" | "DOWNVOTE" | "NONE";

// ── Question types ─────────────────────────────────────────────────────────────

export const questionSortBySchema = z.enum([
  "mostRelevant",
  "newest",
  "oldest",
  "mostVoted",
  "mostAnswered",
]);
export type QuestionSortBy = z.infer<typeof questionSortBySchema>;

export const ForumQuestionStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);
export type ForumQuestionStatus = z.infer<typeof ForumQuestionStatusSchema>;

export const CreateForumQuestionInputSchema = z.object({
  categoryId: z.string(),
  title: z.string(),
  body: z.string(),
  tags: z.array(z.string()),
  imageKey: z.string().nullable(),
  status: ForumQuestionStatusSchema,
});
export type CreateForumQuestionInput = z.infer<
  typeof CreateForumQuestionInputSchema
>;

// ── Answer types ───────────────────────────────────────────────────────────────

export const CreateAnswerInputSchema = z.object({
  questionId: z.string(),
  body: z.string().min(1, "Answer body is required."),
  replyToAnswer: z.string().trim().nullish(),
});
export type CreateAnswerInput = z.infer<typeof CreateAnswerInputSchema>;

export const UpdateAnswerInputSchema = z.object({
  body: z.string().min(1, "Answer body is required."),
});
export type UpdateAnswerInput = z.infer<typeof UpdateAnswerInputSchema>;

export const AnswerStatusSchema = z.enum(["PUBLISHED", "DRAFT"]);
export type AnswerStatus = z.infer<typeof AnswerStatusSchema>;

// ── Category types ─────────────────────────────────────────────────────────────

export const CategoriesPickerSchema = z.object({
  id: z.string(),
  name: z.string(),
  count: z.number().optional(),
});
export type CategoriesPicker = z.infer<typeof CategoriesPickerSchema>;

// ── Image types ────────────────────────────────────────────────────────────────

export const ForumQuestionImagePresignInputSchema = z.object({
  contentType: z
    .string()
    .regex(/^image\/(png|jpe?g|webp|gif)$/i, "Unsupported image type"),
  fileSize: z
    .number()
    .int()
    .positive()
    .max(5 * 1024 * 1024, "Image must be 5MB or smaller"),
});
export type ForumQuestionImagePresignInput = z.infer<
  typeof ForumQuestionImagePresignInputSchema
>;

// ── Report types ───────────────────────────────────────────────────────────────

export const REPORT_DESCRIPTION_MAX_LENGTH = 10000;

const REPORTING_TYPE_ID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const SubmitReportInputSchema = z.object({
  questionId: z.string(),
  answerId: z.string(),
  typeId: z
    .string()
    .regex(REPORTING_TYPE_ID_REGEX, "Invalid report type selected."),
  description: z.string().max(REPORT_DESCRIPTION_MAX_LENGTH).optional(),
});
export type SubmitReportInput = z.infer<typeof SubmitReportInputSchema>;
