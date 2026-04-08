export * from './types/answer';
export * from './types/category';
export * from './types/question';
export * from './types/tags';



export interface Pagination {
  limit: number;
  hasMore: boolean;
  nextCursor: string;
}

export interface BasicJoinType {
  id: string;
  name: string;
}

export type VoteIntent = "UPVOTE" | "DOWNVOTE" | "NONE";

export enum ViewerVote {
  UPVOTE = "UPVOTE",
  DOWNVOTE = "DOWNVOTE",
  NONE = "NONE"
}