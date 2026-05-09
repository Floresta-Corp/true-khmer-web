import { z } from "zod";
import { AuthorSchema, QuestionSchema } from "./question-type";
import { BasicJoinSchema, ViewerVoteSchema } from "~/services/types";
import { CategorySchema } from "./category-type";

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

export const ReplyToAnswerSchema = z.object({
  id: z.string(),
  questionId: z.string(),
  authorId: z.string(),
  author: AuthorSchema,
  body: z.string(),
  status: AnswerStatusSchema,
  upvoteCount: z.number(), 
  downvoteCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
  score: z.number(),
  viewerVote: ViewerVoteSchema,
  replyTo: z.string().nullable(),
});

// 1. Define the schema
export const AnswerSchema = z.lazy(() =>
  z.object({
    id: z.string(),
    questionId: z.string(),
    question: QuestionSchema,
    authorId: z.string(),
    body: z.string(),
    upvoteCount: z.number(),
    downvoteCount: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable(),
    score: z.number(),
    replyTo: z.string().nullable(),
    replyCount: z.number(),
    viewerVote: ViewerVoteSchema,
    status: AnswerStatusSchema,
    author: AuthorSchema,
    // Use z.lazy here to defer the reference to AnswerSchema
    repliedAnswers: z.array(ReplyToAnswerSchema).nullable().optional(),
  }),
);

const MyAnswerQuestionSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  category: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable()
    .optional(),
  title: z.string(),
  body: z.string(),
  status: z.string(),
  answerCount: z.number(),
  upvoteCount: z.number(),
  downvoteCount: z.number(),
  bestAnswerId: z.string().nullable(),
  bestAnswerSelectedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
// 2. The Answer schema that matches your JSON exactly
export const MyAnswerItemSchema = z.object({
  id: z.string(),
  body: z.string(),
  author: AuthorSchema,
  upvoteCount: z.number(),
  downvoteCount: z.number(),
  replyCount: z.number(),
  score: z.number(),
  viewerVote: ViewerVoteSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  status: z.string(),
  replyTo: z.string().nullable(),
  question: MyAnswerQuestionSchema.optional(),
  repliedAnswers: z.array(z.any()).nullable().optional(),
});

// 3. The final Response schema
export const MyAnswersResponseSchema = z.object({
  ok: z.boolean(),
  answers: z.array(MyAnswerItemSchema),
});

export type MyAnswersResponse = z.infer<typeof MyAnswersResponseSchema>;
export type MyAnswerItem = z.infer<typeof MyAnswerItemSchema>;

// 2. You MUST define the type explicitly for recursive schemas
export type Answer = z.infer<typeof AnswerSchema>;

export const GetAnswersResponseSchema = z.object({
  ok: z.boolean(),
  answers: z.object({
    bestAnswer: z.array(AnswerSchema),
    answers: z.array(AnswerSchema),
  }),
});
export type GetAnswersResponse = z.infer<typeof GetAnswersResponseSchema>;

export const UpsertAnswerResponseSchema = z.object({
  ok: z.boolean(),
  answer: AnswerSchema,
});
export type UpsertAnswerResponse = z.infer<typeof UpsertAnswerResponseSchema>;

export const VoteAnswerResponseSchema = z.object({
  ok: z.boolean(),
  answer: AnswerSchema,
});
export type VoteAnswerResponse = z.infer<typeof VoteAnswerResponseSchema>;

export const DeleteAnswerResponseSchema = z.object({
  ok: z.boolean(),
});
export type DeleteAnswerResponse = z.infer<typeof DeleteAnswerResponseSchema>;
