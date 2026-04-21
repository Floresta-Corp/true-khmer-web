import { z } from "zod";

export const BasicJoinSchema = z.object({
    id: z.string(),
    name: z.string(),
});

export type BasicJoinType = z.infer<typeof BasicJoinSchema>;

export const VoteIntentSchema = z.enum(["UPVOTE", "DOWNVOTE", "NONE"]);
export type VoteIntent = z.infer<typeof VoteIntentSchema>;

export const ViewerVoteSchema = VoteIntentSchema;
export const ViewerVote = ViewerVoteSchema.enum;
export type ViewerVote = z.infer<typeof ViewerVoteSchema>;

export const PaginationSchema = z.object({
    limit: z.number(),
    hasMore: z.boolean(),
    nextCursor: z.null(),
});
export type Pagination = z.infer<typeof PaginationSchema>;