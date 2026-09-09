import type { MetaDescriptor } from "react-router";

import { toIsoDate } from "./date";
import { META_DESCRIPTION_MAX, SITE } from "./site";
import { toDescription, truncate } from "./text";

export type SeoImage = {
  /** Absolute URL, or a path relative to the site origin. */
  url: string;
  alt?: string;
  width?: number;
  height?: number;
};

/** The `article:*` properties, for anything with an author and a publish date. */
export type SeoArticle = {
  publishedTime?: string | null;
  modifiedTime?: string | null;
  authors?: readonly string[];
  section?: string | null;
  tags?: readonly string[];
};

export type SeoInput = {
  /** Page title without the brand — the suffix is added unless `bareTitle`. */
  title: string;
  description?: string | null;
  /** Path of the canonical URL, e.g. `/blog/my-post`. Query strings are
      dropped: a filtered or paginated view canonicalises to the clean path. */
  pathname: string;
  origin: string;
  type?: "website" | "article" | "profile";
  image?: SeoImage | string | null;
  /** Keeps a page out of the index while leaving it reachable. */
  noindex?: boolean;
  article?: SeoArticle;
  /** JSON-LD blocks, rendered as `<script type="application/ld+json">`. */
  jsonLd?: readonly object[];
  /** For titles that already carry the brand, so it is not repeated. */
  bareTitle?: boolean;
  /** Overrides the canonical when a page has a preferred other URL, e.g. a
      paginated `?page=2` view pointing at page 1. */
  canonicalPath?: string;
};

function absolute(origin: string, target: string): string | null {
  if (/^https?:\/\//i.test(target)) return target;
  if (!origin) return null;
  return `${origin}${target.startsWith("/") ? target : `/${target}`}`;
}

/**
 * Reduce a URL to the one form that should be indexed.
 *
 * The query string goes: every filter, sort, search term and campaign tag on
 * this site produces a view of content that already has its own canonical URL,
 * and left alone those permutations multiply into thousands of near-duplicate
 * pages competing with each other. The listings that take a `?page=` load
 * cumulatively -- page 3 contains page 1 -- so they collapse here correctly
 * too. A route that genuinely needs a query in its canonical passes
 * `canonicalPath`, which is kept verbatim.
 */
function normalisePath(pathname: string): string {
  const [path] = pathname.split(/[?#]/);
  if (!path || path === "/") return "/";
  return path.replace(/\/+$/, "") || "/";
}

function canonicalFor(input: SeoInput): string {
  if (!input.canonicalPath) return normalisePath(input.pathname);

  const [path, query] = input.canonicalPath.split("?");
  const base = normalisePath(path);
  return query ? `${base}?${query}` : base;
}

function resolveImage(
  origin: string,
  image: SeoInput["image"],
): SeoImage | null {
  if (!image) {
    const url = absolute(origin, SITE.ogImagePath);
    return url
      ? {
          url,
          alt: `${SITE.name} — ${SITE.tagline}`,
          width: SITE.ogImageWidth,
          height: SITE.ogImageHeight,
        }
      : null;
  }

  const raw = typeof image === "string" ? { url: image } : image;
  const url = absolute(origin, raw.url);
  if (!url) return null;

  return { ...raw, url };
}

/**
 * Every meta tag a page needs, from one description of the page.
 *
 * Written as one builder rather than per-route tag lists because the failure
 * mode of hand-rolled SEO tags is silent: a page ships with a title and no
 * `og:image`, and nobody notices until a link into it renders as a bare URL in
 * a chat. Going through here means a route cannot forget the canonical, the
 * Open Graph card or the Twitter card, and a fix to any of them lands
 * everywhere at once.
 */
export function buildSeoMeta(input: SeoInput): MetaDescriptor[] {
  const {
    origin,
    type = "website",
    noindex = false,
    bareTitle = false,
  } = input;

  const title = bareTitle ? input.title : `${input.title} | ${SITE.name}`;
  const description = toDescription(
    input.description || SITE.description,
    META_DESCRIPTION_MAX,
  );
  const canonical = absolute(origin, canonicalFor(input));
  const image = resolveImage(origin, input.image);

  const tags: MetaDescriptor[] = [
    { title },
    { name: "description", content: description },
  ];

  // `max-image-preview:large` is what earns the big thumbnail in Google's
  // results and Discover; without it a content site gets a text-only row.
  tags.push({
    name: "robots",
    content: noindex
      ? "noindex, nofollow"
      : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  });

  if (canonical) {
    tags.push({ tagName: "link", rel: "canonical", href: canonical });
  }

  tags.push(
    { property: "og:site_name", content: SITE.name },
    { property: "og:type", content: type },
    { property: "og:title", content: truncate(input.title, 95) },
    { property: "og:description", content: description },
    { property: "og:locale", content: SITE.locale },
  );

  for (const locale of SITE.localeAlternates) {
    tags.push({ property: "og:locale:alternate", content: locale });
  }

  if (canonical) {
    tags.push({ property: "og:url", content: canonical });
  }

  if (image) {
    tags.push(
      { property: "og:image", content: image.url },
      { property: "og:image:secure_url", content: image.url },
      { property: "og:image:alt", content: image.alt ?? input.title },
    );
    if (image.width) {
      tags.push({
        property: "og:image:width",
        content: String(image.width),
      });
    }
    if (image.height) {
      tags.push({
        property: "og:image:height",
        content: String(image.height),
      });
    }
  }

  tags.push(
    {
      name: "twitter:card",
      content: image ? "summary_large_image" : "summary",
    },
    { name: "twitter:title", content: truncate(input.title, 70) },
    { name: "twitter:description", content: description },
  );

  if (image) {
    tags.push(
      { name: "twitter:image", content: image.url },
      { name: "twitter:image:alt", content: image.alt ?? input.title },
    );
  }

  if (type === "article" && input.article) {
    const {
      publishedTime,
      modifiedTime,
      authors,
      section,
      tags: topics,
    } = input.article;

    const published = toIsoDate(publishedTime);
    const modified = toIsoDate(modifiedTime);

    if (published) {
      tags.push({ property: "article:published_time", content: published });
    }
    if (modified) {
      tags.push({ property: "article:modified_time", content: modified });
    }
    for (const author of authors ?? []) {
      tags.push({ property: "article:author", content: author });
    }
    if (section) {
      tags.push({ property: "article:section", content: section });
    }
    for (const topic of topics ?? []) {
      tags.push({ property: "article:tag", content: topic });
    }
  }

  for (const block of input.jsonLd ?? []) {
    tags.push({ "script:ld+json": block });
  }

  return tags;
}

/** Absolute URL for a site path, for JSON-LD and sitemap entries. */
export function siteUrl(origin: string, pathname = "/"): string {
  return absolute(origin, normalisePath(pathname)) ?? normalisePath(pathname);
}
