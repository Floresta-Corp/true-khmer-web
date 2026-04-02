import CategoriesPicker from "~/features/forum/components/CategoriesPicker";
export * from './type/answer';
export * from './type/category';
export * from './type/question';


export interface Pagination {
  limit: number;
  hasMore: boolean;
  nextCursor: string;
}


export type VoteIntent = "UPVOTE" | "DOWNVOTE" | "NONE";

export enum ViewerVote {
  UPVOTE = "UPVOTE",
  DOWNVOTE = "DOWNVOTE",
  NONE = "NONE"
}