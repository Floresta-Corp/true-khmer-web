export interface GetQuestionpaginationResponse {
  ok: boolean;
  questions: Question[];
  pagination: Pagination;
}

export interface Pagination {
  limit: number;
  hasMore: boolean;
  nextCursor: string;
}

export interface GetQuestionResponse {
  ok: boolean;
  question: Question;
}

export interface Question {
  id: string;
  category: {
    id: string;
    name: string;
  };
  author: {
    id: string;
    name: string;
    avatarKey?: string;
    role?: string;
  };
  title: string;
  body: string;
  status: string;
  answerCount: number;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export type ForumPostStatus = "DRAFT" | "PUBLISHED";

export interface CreateForumPostInput {
  categoryId: string;
  title: string;
  body: string;
  tags: string[];
  status: ForumPostStatus;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface GetCategoryResponse {
  ok: boolean;
  categories: Category[];
}

export type AnswerStatus = "PUBLISHED" | "DRAFT";
export type ViewerVote = "UPVOTE" | "DOWNVOTE" | null;

export interface Answer {
  id: string;
  questionId: string;
  authorId: string;
  body: string;
  status: AnswerStatus;
  upvoteCount: number;
  downvoteCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  /** Net score (upvoteCount - downvoteCount) */
  score: number;
  /** The current viewer's vote on this answer, or null if they haven't voted */
  viewerVote: ViewerVote;
}

export interface GetAnswersResponse {
  ok: boolean;
  answers: Answer[];
}
