import * as z from "zod";
import { QuestionSchema } from "../forum/types";
import { PaginationSchema } from "../types";
import { OpportunitySchema } from "../volunteer/types";
import { LaunchpadOpportunitySchema } from "../launchpad/types";

export const getSaveForumQuestionSchema = z.object({
  ok: z.boolean(),
  questions: z.array(QuestionSchema),
  pagination: PaginationSchema,
});
export type GetSaveForumQuestionResponse = z.infer<
  typeof getSaveForumQuestionSchema
>;

export const GetSavedVolunteerOpportunitiesSchema = z.object({
  ok: z.boolean(),
  opportunities: z.array(OpportunitySchema),
  pagination: PaginationSchema,
});
export type GetSavedVolunteerOpportunitiesResponse = z.infer<
  typeof GetSavedVolunteerOpportunitiesSchema
>;

export const GetSavedLaunchpadOpportunitiesSchema = z.object({
  ok: z.boolean(),
  launchpads: z.array(LaunchpadOpportunitySchema),
  nextCursor: z.null(),
});
export type GetSavedLaunchpadOpportunitiesResponse = z.infer<
  typeof GetSavedLaunchpadOpportunitiesSchema
>;
