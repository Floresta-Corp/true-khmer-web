import type { MetaDescriptor } from "react-router";

import { buildSeoMeta, type SeoInput } from "./meta";
import { isPrivatePath } from "./robots-policy";
import { rootSeo } from "./root-seo";
import { organizationJsonLd } from "./structured-data";

/**
 * Structurally what a generated `Route.MetaArgs` gives us. Typed loosely on
 * purpose: every route's generated `MetaArgs` differs in its `matches` tuple,
 * and this helper only ever reads the pathname and the root match.
 */
type MetaArgsLike = {
  location: { pathname: string };
  matches: readonly ({ id?: string; data?: unknown } | null | undefined)[];
};

export type PageMetaInput = Omit<SeoInput, "origin" | "pathname"> & {
  /** Defaults to the current pathname. */
  pathname?: string;
};

/**
 * The one call a route's `meta` makes.
 *
 * It fills in the three things a route should not have to think about: the
 * canonical origin, whether this deployment is allowed in the index at all, and
 * whether the path is one of the private areas that must carry `noindex`. A
 * route is then left describing only its own content.
 */
export function pageMeta(
  args: MetaArgsLike,
  input: PageMetaInput,
): MetaDescriptor[] {
  const { origin, indexable } = rootSeo(args.matches);
  const pathname = input.pathname ?? args.location.pathname;
  const noindex =
    Boolean(input.noindex) || !indexable || isPrivatePath(pathname);

  return buildSeoMeta({
    ...input,
    origin,
    pathname,
    noindex,
    // Every other entity refers to the publisher by `@id`, so the Organization
    // node has to be present in the same document for that reference to
    // resolve. Prepending it here is what lets a route pass just its own
    // entity. Skipped on a page that is not going in the index anyway.
    jsonLd:
      noindex || !origin
        ? []
        : [organizationJsonLd(origin), ...(input.jsonLd ?? [])],
  });
}

/** The resolved origin, for a route that needs to build JSON-LD itself. */
export function metaOrigin(args: MetaArgsLike): string {
  return rootSeo(args.matches).origin;
}
