import * as z from "zod";
import { RoleSchema } from "./opportunities";

export const ApplyApplicationInputSchema = z.object({
  roleId: z.string(),
  availability: z.string(),
  relevantExperience: z.string(),
  supportingDocumentKeys: z.array(z.string()),
});
export type ApplyApplicationInput = z.infer<typeof ApplyApplicationInputSchema>;

export const ApplicationSchema = z.object({
  id: z.string(),
  opportunityId: z.string(),
  role: RoleSchema,
  availability: z.string(),
  relevantExperience: z.string(),
  supportingDocumentKeys: z.array(z.string()),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Application = z.infer<typeof ApplicationSchema>;

export const ApplyApplicationResponseSchema = z.object({
  ok: z.boolean(),
  application: ApplicationSchema,
});
export type ApplyApplicationResponse = z.infer<
  typeof ApplyApplicationResponseSchema
>;

export const UploadApplicationDocumentSchema = z.object({
  opportunityId: z.string(),
  files: z.array(
    z.object({
      contentType: z.string(),
      fileSize: z.number(),
    }),
  ),
});
export type UploadApplicationDocumentInput = z.infer<
  typeof UploadApplicationDocumentSchema
>;

export const UploadApplicationDocumentResponseSchema = z.object({
  ok: z.boolean(),
  uploads: z.array(
    z.object({
      uploadUrl: z.string(),
      method: z.string(),
      requiredHeaders: z.object({
        "Content-Length": z.string(),
        "Content-Type": z.string(),
      }),
      supportingDocumentKey: z.string(),
      expiresInSeconds: z.number(),
    }),
  ),
});
export type UploadApplicationDocumentResponse = z.infer<
  typeof UploadApplicationDocumentResponseSchema
>;
