import * as z from "zod";

/**
 * Hand-written rather than pulled from ~/types/api-client: that file is
 * generated from the staging OpenAPI document (`bun run api`), which does not
 * carry /saved-items yet. Regenerate and swap these over once the API ships.
 */

export const SavedItemTypeSchema = z.enum([
  "forum",
  "volunteer",
  "project",
  "course",
  "event",
]);
export type SavedItemType = z.infer<typeof SavedItemTypeSchema>;

/** Types that live in our own tables, so they are addressed by id. */
export const LocalSavedItemTypeSchema = z.enum([
  "forum",
  "volunteer",
  "project",
  "course",
]);
export type LocalSavedItemType = z.infer<typeof LocalSavedItemTypeSchema>;

/** Tab ids. "all" is the unfiltered view; the rest map 1:1 onto item types. */
export type FilterId = "all" | SavedItemType;

/**
 * One shape for every saved row whatever it points at. Cards render this
 * directly and never branch on where the item came from.
 */
export const SavedItemCardSchema = z.object({
  id: z.string(),
  itemId: z.string(),
  type: SavedItemTypeSchema,
  title: z.string(),
  imageUrl: z.string().nullable(),
  webHref: z.string(),
  savedAt: z.string(),
  isExternal: z.boolean(),
  /**
   * The full item behind the row, shaped per `type`, so each card renders the
   * same as it does on its own listing. Loose here and narrowed at the point
   * of render, exactly as the old saved endpoint's payloads were.
   */
  item: z.unknown().optional(),
});
export type SavedItemCard = z.infer<typeof SavedItemCardSchema>;

export const SavedItemCountsSchema = z.object({
  all: z.number(),
  forum: z.number(),
  volunteer: z.number(),
  project: z.number(),
  course: z.number(),
  event: z.number(),
});
export type SavedItemCounts = z.infer<typeof SavedItemCountsSchema>;

export const GetSavedItemsSchema = z.object({
  ok: z.boolean(),
  items: z.array(SavedItemCardSchema),
  nextCursor: z.string().nullable(),
  counts: SavedItemCountsSchema,
});
export type GetSavedItemsResponse = z.infer<typeof GetSavedItemsSchema>;

export const ToggleSavedItemSchema = z.object({
  ok: z.boolean(),
  saved: z.boolean(),
});
export type ToggleSavedItemResponse = z.infer<typeof ToggleSavedItemSchema>;

export const EMPTY_SAVED_ITEM_COUNTS: SavedItemCounts = {
  all: 0,
  forum: 0,
  volunteer: 0,
  project: 0,
  course: 0,
  event: 0,
};

/**
 * The tab bar has always used "launchpad" in the URL; the API calls the same
 * thing "project". Kept so existing bookmarks keep working.
 */
export function filterIdToItemType(
  filter: string | null,
): SavedItemType | undefined {
  if (!filter || filter === "all") return undefined;
  const normalized = filter === "launchpad" ? "project" : filter;
  const parsed = SavedItemTypeSchema.safeParse(normalized);
  return parsed.success ? parsed.data : undefined;
}
