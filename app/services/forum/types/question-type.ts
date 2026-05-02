import { z } from "zod";
import {
  BasicJoinSchema,
  PaginationSchema,
  ViewerVoteSchema,
} from "~/services/types";

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

export const AuthorSchema = BasicJoinSchema.extend({
  avatarKey: z.string(),
});
export type Author = z.infer<typeof AuthorSchema>;

export const QuestionSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  status: ForumQuestionStatusSchema,
  answerCount: z.number(),
  upvoteCount: z.number(),
  downvoteCount: z.number(),
  score: z.number(),
  viewerVote: ViewerVoteSchema,
  viewerSave: z.boolean(),
  bestAnswerId: z.string().nullable(),
  bestAnswerSelectedAt: z.string().nullable(),
  category: BasicJoinSchema,
  author: AuthorSchema,
  tags: z.array(BasicJoinSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Question = z.infer<typeof QuestionSchema>;

export const GetQuestionPaginationResponseSchema = z.object({
  ok: z.boolean(),
  questions: z.array(QuestionSchema),
  pagination: PaginationSchema,
});
export type GetQuestionPaginationResponse = z.infer<
  typeof GetQuestionPaginationResponseSchema
>;

export const GetQuestionResponseSchema = z.object({
  ok: z.boolean(),
  question: QuestionSchema,
});
export type GetQuestionResponse = z.infer<typeof GetQuestionResponseSchema>;

export const CreateForumQuestionInputSchema = z.object({
  categoryId: z.string(),
  title: z.string(),
  body: z.string(),
  tags: z.array(z.string()),
  status: ForumQuestionStatusSchema,
});
export type CreateForumQuestionInput = z.infer<
  typeof CreateForumQuestionInputSchema
>;
