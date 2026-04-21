import { z } from "zod";

export const CategorySchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    displayOrder: z.number(),
    status: z.string(),
    createdBy: z.string(),
    updatedBy: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    archivedAt: z.null(),
    questionCount: z.number(),
});
export type Category = z.infer<typeof CategorySchema>;

export const GetCategoriesListResponseSchema = z.object({
    ok: z.boolean(),
    categories: z.array(CategorySchema),
});
export type GetCategoriesListResponse = z.infer<
    typeof GetCategoriesListResponseSchema
>;

export const CategoriesPickerSchema = z.object({
    id: z.string(),
    name: z.string(),
    count: z.number().optional(),
});
export type CategoriesPicker = z.infer<typeof CategoriesPickerSchema>;