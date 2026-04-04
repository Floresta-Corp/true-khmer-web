export * from './type/answer';
export * from './type/category';
export * from './type/question';
export * from './type/tags';



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