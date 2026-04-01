import CategoriesPicker from "~/features/forum/components/CategoriesPicker";

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

export interface Author {
  id: string;
  name: string;
  avatarKey: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Question {
  id: string;
  category: Category;
  author: Author;
  title: string;
  body: string;
  status: string;
  answerCount: number;
  upvoteCount: number;
  downvoteCount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  score: number;
  viewerVote: string;
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

export interface GetCategoriesListResponse {
  ok: boolean;
  categories: Category[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  status: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  archivedAt: null;
}

export type CategoriesPicker = {
  id: string;
  name: string;
};
