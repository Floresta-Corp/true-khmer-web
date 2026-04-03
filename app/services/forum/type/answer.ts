import z from "zod";
import type { Author, ViewerVote } from "../types";

export const CreateAnswerInputSchema = z.object({
    questionId: z.string(),
    body: z.string().trim().min(1, "Answer body is required."),
});

export type CreateAnswerInput = z.infer<typeof CreateAnswerInputSchema>;

export const UpdateAnswerInputSchema = z.object({
    body: z.string().trim().min(1, "Answer body is required."),
});

export type UpdateAnswerInput = z.infer<typeof UpdateAnswerInputSchema>;

export interface GetAnswersResponse {
    ok: boolean;
    answers: Answer[];
}

export interface UpsertAnswerResponse {
    ok: boolean;
    answer: Answer;
}

export interface VoteAnswerResponse {
    ok: boolean;
    answer: Answer;
}

export interface DeleteAnswerResponse {
    ok: boolean;
}

export type AnswerStatus = "PUBLISHED" | "DRAFT";

export interface Answer {
    id: string;
    questionId: string;
    authorId: string;
    body: string;
    status: AnswerStatus;
    answerCount: number;
    upvoteCount: number;
    downvoteCount: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    /** Net score (upvoteCount - downvoteCount) */
    score: number;
    /** The current viewer's vote on this answer, or null if they haven't voted */
    viewerVote: ViewerVote;
    author: Author;
}