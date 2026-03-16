export interface GetQuestionResponse {
  ok: boolean;
  question: Question;
}

export interface Question {
  id: string;
  categoryId: string;
  authorId: string;
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
