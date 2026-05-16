import * as z from "zod";
import { ApplicantSchema } from "./detail-post-type";

export const DetailCandidateSchema = z.object({
  applicant: ApplicantSchema,
  ok: z.boolean(),
});
export type DetailCandidateResponse = z.infer<typeof DetailCandidateSchema>;
