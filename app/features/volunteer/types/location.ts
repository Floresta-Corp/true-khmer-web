import * as z from "zod";

export const LocationSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type Location = z.infer<typeof LocationSchema>;

export const GetVolunteerLocationsResponseSchema = z.object({
  ok: z.boolean(),
  locations: z.array(LocationSchema),
});

export type GetVolunteerLocationsResponse = z.infer<
  typeof GetVolunteerLocationsResponseSchema
>;

export const LocationFilterSchema = z.object({
  cursor: z.string().nullish(),
  limit: z.number().nullish(),
  search: z.string().nullish(),
});

export type LocationFilter = z.infer<typeof LocationFilterSchema>;
