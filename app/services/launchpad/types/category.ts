import * as z from "zod";

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  iconKey: z.string(),
  displayOrder: z.number(),
  status: z.string(),
  roleCount: z.number(),
  createdBy: z.string(),
  updatedBy: z.string().nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Category = z.infer<typeof CategorySchema>;

export const GetLaunchpadCategoriesResponseSchema = z.object({
  ok: z.boolean(),
  categories: z.array(CategorySchema),
});
export type GetLaunchpadCategoriesResponse = z.infer<
  typeof GetLaunchpadCategoriesResponseSchema
>;
