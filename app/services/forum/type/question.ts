import type { Pagination, ViewerVote, Category } from "../types";

export interface GetQuestionpaginationResponse {

    ok: boolean;
    questions: Question[];
    pagination: Pagination;
}

export interface GetQuestionResponse {
    ok: boolean;
    question: Question;
}

export interface Author {
    id: string;
    name: string;
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
    category: Category;
    author: Author;
    tags: string[];
}

export type ForumQuestionStatus = "DRAFT" | "PUBLISHED";

export interface CreateForumQuestionInput {
    categoryId: string;
    title: string;
    body: string;
    tags: string[];
    status: ForumQuestionStatus;
}