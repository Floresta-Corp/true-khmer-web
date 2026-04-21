import { z } from "zod";

export const TagSchema = z.object({
    id: z.string(),
    name: z.string(),
    count: z.number(),
});
export type Tag = z.infer<typeof TagSchema>;

export const GetTrendingTagsResponseSchema = z.object({
    ok: z.boolean(),
    tags: z.array(TagSchema),
});
export type GetTrendingTagsResponse = z.infer<
    typeof GetTrendingTagsResponseSchema
>;
