import * as z from "zod";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const ApplicationDocumentPresignInputSchema = z.object({
  contentType: z.string().min(1),
  fileSize: z.number().int().gt(0).max(10485760),
});

export type ApplicationDocumentPresignInput = z.infer<
  typeof ApplicationDocumentPresignInputSchema
>;

export const ApplicationDocumentPresignResponseSchema = z
  .object({
    ok: z.boolean().optional(),
    upload: z
      .object({
        uploadUrl: z.string(),
        method: z.string().default("PUT"),
        requiredHeaders: z.record(z.string(), z.string()).optional(),
        documentKey: z.string().optional(),
        key: z.string().optional(),
        fileKey: z.string().optional(),
      })
      .passthrough(),
  })
  .passthrough();

export type ApplicationDocumentPresignResponse = z.infer<
  typeof ApplicationDocumentPresignResponseSchema
>;

export const ApplyRoleInputSchema = z.object({
  launchpadRoleId: z.string().regex(UUID_PATTERN),
  motivation: z.string().min(5).max(2000),
  portfolio: z.string().url().max(255).optional(),
  documentKeys: z.array(z.string()).max(5).default([]),
  documentNames: z.array(z.string()).max(5).default([]),
});

export type ApplyRoleInput = z.infer<typeof ApplyRoleInputSchema>;

export const ApplyRoleResponseSchema = z
  .object({
    ok: z.boolean(),
    application: z
      .object({
        id: z.string(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

export type ApplyRoleResponse = z.infer<typeof ApplyRoleResponseSchema>;
