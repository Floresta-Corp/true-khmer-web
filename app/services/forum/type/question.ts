import type { Pagination, ViewerVote, Category, BasicJoinType } from "../types";

export interface GetQuestionpaginationResponse {

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