import * as z from "zod";

export const VolunteerCategoryStatusSchema = z.enum([
  "ACTIVE",
  "ARCHIVED",
  "HIDDEN",
]);

export type VolunteerCategoryStatus = z.infer<
  typeof VolunteerCategoryStatusSchema
>;

export const VolunteerCategorySchema = z.object({
  id: z.string(),
  slug: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  iconKey: z.string().optional(),
  displayOrder: z.number().optional(),
  status: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  archivedAt: z.string().optional(),
  opportunityCount: z.number().optional(),
});

export type VolunteerCategory = z.infer<typeof VolunteerCategorySchema>;

export const CreateVolunteerCategoryInputSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  iconKey: z.string().nullable(),
  status: VolunteerCategoryStatusSchema,
});

export type CreateVolunteerCategoryInput = z.infer<
  typeof CreateVolunteerCategoryInputSchema
>;

export const CreateVolunteerCategoryResponseSchema = z.object({
  ok: z.boolean(),
  category: VolunteerCategorySchema,
});

export type CreateVolunteerCategoryResponse = z.infer<
  typeof CreateVolunteerCategoryResponseSchema
>;

export const GetVolunteerCategoriesResponseSchema = z.object({
  ok: z.boolean(),
  categories: z.array(VolunteerCategorySchema),
});

export type GetVolunteerCategoriesResponse = z.infer<
  typeof GetVolunteerCategoriesResponseSchema
>;
