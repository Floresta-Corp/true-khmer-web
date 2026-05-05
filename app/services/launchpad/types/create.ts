import * as z from "zod";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const LaunchpadRoleInputSchema = z.object({
  name: z.string().min(1).max(100),
  capacity: z.number().int().gt(0).max(1000),
  description: z.string().nullable().optional(),
});

export const LaunchpadCreateInputSchema = z.object({
  categoryId: z.string().regex(UUID_PATTERN),
  cityId: z.string().regex(UUID_PATTERN),
  coverKey: z.string().min(1).max(255),
  deadline: z.string().datetime({ offset: true }),
  email: z.string().email().max(255),
  logoKey: z.string().min(1).max(255),
  materialDocumentKey: z.array(z.string().min(1)).min(1).max(5),
  materialDocumentName: z.array(z.string().min(1)).min(1).max(5),
  name: z.string().min(1).max(120),
  phoneNumber: z.string().min(1),
  role: z.array(LaunchpadRoleInputSchema).min(1),
  description: z.string().nullable().optional(),
  telegramUsername: z.string().nullable().optional(),
});

export type LaunchpadCreateInput = z.infer<typeof LaunchpadCreateInputSchema>;

export const LaunchpadCreateDraftInputSchema = z.object({
  categoryId: z.string().regex(UUID_PATTERN),
  cityId: z.string().regex(UUID_PATTERN),
  deadline: z.string().datetime({ offset: true }),
  email: z.string().email().max(255),
  materialDocumentName: z.array(z.string().min(1)).min(1).max(5),
  name: z.string().min(1).max(120),
  phoneNumber: z.string().min(1),
  role: z.array(LaunchpadRoleInputSchema).min(1),
  description: z.string().nullable().optional(),
  telegramUsername: z.string().nullable().optional(),
});

export type LaunchpadCreateDraftInput = z.infer<
  typeof LaunchpadCreateDraftInputSchema
>;

export const LaunchpadCreateResponseSchema = z.object({
  ok: z.boolean(),
  launchpad: z
    .object({
      id: z.string(),
    })
    .passthrough(),
});

export type LaunchpadCreateResponse = z.infer<
  typeof LaunchpadCreateResponseSchema
>;

export const LaunchpadPresignInputSchema = z.object({
  contentType: z.string().min(1),
  fileSize: z.number().int().gt(0),
});

export type LaunchpadPresignInput = z.infer<typeof LaunchpadPresignInputSchema>;

export const LaunchpadRequiredHeadersSchema = z.record(z.string(), z.string());

export const LaunchpadPresignedUploadSchema = z
  .object({
    uploadUrl: z.string(),
    method: z.string().default("PUT"),
    requiredHeaders: LaunchpadRequiredHeadersSchema.optional(),
    logoKey: z.string().optional(),
    coverKey: z.string().optional(),
    documentKey: z.string().optional(),
    materialDocumentKey: z.string().optional(),
    fileKey: z.string().optional(),
    key: z.string().optional(),
  })
  .passthrough();

export type LaunchpadPresignedUpload = z.infer<
  typeof LaunchpadPresignedUploadSchema
>;

const LaunchpadPresignResponseBaseSchema = z
  .object({
    ok: z.boolean().optional(),
    upload: LaunchpadPresignedUploadSchema,
  })
  .passthrough();

export const LaunchpadLogoPresignResponseSchema =
  LaunchpadPresignResponseBaseSchema;
export const LaunchpadCoverPresignResponseSchema =
  LaunchpadPresignResponseBaseSchema;
export const LaunchpadDocumentPresignResponseSchema =
  LaunchpadPresignResponseBaseSchema;

export type LaunchpadLogoPresignResponse = z.infer<
  typeof LaunchpadLogoPresignResponseSchema
>;
export type LaunchpadCoverPresignResponse = z.infer<
  typeof LaunchpadCoverPresignResponseSchema
>;
export type LaunchpadDocumentPresignResponse = z.infer<
  typeof LaunchpadDocumentPresignResponseSchema
>;
