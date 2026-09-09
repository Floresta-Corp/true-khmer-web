/**
 * The SEO context every route's `meta` needs, published once by the root
 * loader and read back out of `matches`.
 *
 * A `meta` function is handed `location`, which carries a pathname but no host,
 * and it also runs in the browser on client-side navigations. Canonical and
 * `og:url` have to be absolute, so the origin travels with the route data
 * instead of being read from the environment at tag-building time.
 */
export type RootSeo = {
  origin: string;
  /** False on staging and preview hosts, which are held out of the index. */
  indexable: boolean;
};

type MetaMatch = { id?: string; data?: unknown } | null | undefined;

const EMPTY: RootSeo = { origin: "", indexable: false };

/**
 * Pull the root SEO context out of a `meta` function's `matches`.
 *
 * Degrades to an empty origin rather than throwing: if root data is somehow
 * missing, the page still gets its title, description and card copy, and only
 * the absolute URLs are dropped. A half-tagged page beats a 500.
 */
export function rootSeo(matches: readonly MetaMatch[]): RootSeo {
  for (const match of matches) {
    if (!match || match.id !== "root") continue;

    const data = match.data;
    if (!data || typeof data !== "object") continue;

    const seo = (data as { seo?: Partial<RootSeo> }).seo;
    if (seo && typeof seo.origin === "string") {
      return { origin: seo.origin, indexable: seo.indexable !== false };
    }
  }

  return EMPTY;
}
