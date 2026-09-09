/**
 * Walk a paginated listing endpoint until it runs out.
 *
 * Capped, because these routes are cheap for a crawler to hit and expensive for
 * us to serve: without a ceiling one `/sitemap-blog.xml` fetch could fan out
 * into an unbounded number of API calls. The cap is generous enough that
 * hitting it means the section has outgrown one file and wants splitting, which
 * the log line says out loud.
 */
const DEFAULT_MAX_PAGES = 20;

export async function collectPaged<T>(
  label: string,
  read: (page: number) => Promise<{ items: T[]; hasMore: boolean } | null>,
  maxPages = DEFAULT_MAX_PAGES,
): Promise<T[]> {
  const collected: T[] = [];

  for (let page = 1; page <= maxPages; page += 1) {
    let result: { items: T[]; hasMore: boolean } | null;
    try {
      result = await read(page);
    } catch (error) {
      // A partial sitemap beats none: the URLs already gathered are still
      // valid, and the next crawl picks up the rest.
      console.warn(`[sitemap] ${label} page ${page} failed:`, error);
      break;
    }

    if (!result) break;
    collected.push(...result.items);
    if (!result.hasMore || result.items.length === 0) return collected;

    if (page === maxPages) {
      console.warn(
        `[sitemap] ${label} still had more after ${maxPages} pages; split this sitemap`,
      );
    }
  }

  return collected;
}

/** The cursor-paged variant, for the endpoints that return a `nextCursor`. */
export async function collectCursored<T>(
  label: string,
  read: (
    cursor: string | null,
  ) => Promise<{ items: T[]; nextCursor: string | null } | null>,
  maxPages = DEFAULT_MAX_PAGES,
): Promise<T[]> {
  const collected: T[] = [];
  let cursor: string | null = null;

  for (let page = 1; page <= maxPages; page += 1) {
    let result: { items: T[]; nextCursor: string | null } | null;
    try {
      result = await read(cursor);
    } catch (error) {
      console.warn(`[sitemap] ${label} page ${page} failed:`, error);
      break;
    }

    if (!result) break;
    collected.push(...result.items);
    if (!result.nextCursor || result.items.length === 0) return collected;
    cursor = result.nextCursor;

    if (page === maxPages) {
      console.warn(
        `[sitemap] ${label} still had more after ${maxPages} pages; split this sitemap`,
      );
    }
  }

  return collected;
}
