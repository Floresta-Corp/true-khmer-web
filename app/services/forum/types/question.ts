import { z } from "zod";
import type { Pagination, ViewerVote, BasicJoinType } from "../types";

export const questionSortBySchema = z.enum([
    "recent",
    "topRated",
    "unanswered",
    "myActivity",
]);

export type QuestionSortBy = z.infer<typeof questionSortBySchema>;

export interface GetQuestionPaginationResponse {
    ok: boolean;
    questions: Question[];
    pagination: Pagination;
}

export interface GetQuestionResponse {
    ok: boolean;
    question: Question;
}

export interface Author extends BasicJoinType {
    avatarKey: string;
}



export interface Question {
    id: string;
    title: string;
    body: string;
    status: ForumQuestionStatus;
    answerCount: number;
    upvoteCount: number;
    downvoteCount: number;
    createdAt: string;
    updatedAt: string;
    score: number;
    viewerVote: ViewerVote;
    category: BasicJoinType;
    author: Author;
    tags: BasicJoinType[];
}

export type ForumQuestionStatus = "DRAFT" | "PUBLISHED";

export interface CreateForumQuestionInput {
    categoryId: string;
    title: string;
    body: string;
    tags: string[];
    status: ForumQuestionStatus;
}