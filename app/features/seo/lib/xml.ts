import { siteUrl } from "~/lib/seo";

/** One `<url>` entry. `path` is site-relative; the origin is added here. */
export type SitemapEntry = {
  path: string;
  /** ISO date or datetime. Omitted when the record has no reliable timestamp
      -- a `lastmod` that is always "today" trains crawlers to ignore it. */
  lastmod?: string | null;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  /** Relative importance within this site, 0.0-1.0. */
  priority?: number;
};

const XML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

export function xmlEscape(value: string): string {
  return value.replace(/[&<>"']/g, (char) => XML_ESCAPES[char]);
}

/**
 * Normalise a timestamp to the W3C form sitemaps require.
 *
 * Anything unparseable is dropped rather than emitted as-is: one malformed
 * `lastmod` makes Search Console reject the whole file.
 */
function toLastmod(value: string | null | undefined): string | null {
  if (!value) return null;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.toISOString();
}

function renderEntry(origin: string, entry: SitemapEntry): string {
  const parts = [`    <loc>${xmlEscape(siteUrl(origin, entry.path))}</loc>`];

  const lastmod = toLastmod(entry.lastmod);
  if (lastmod) parts.push(`    <lastmod>${lastmod}</lastmod>`);
  if (entry.changefreq) {
    parts.push(`    <changefreq>${entry.changefreq}</changefreq>`);
  }
  if (entry.priority !== undefined) {
    parts.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
  }

  return `  <url>\n${parts.join("\n")}\n  </url>`;
}

export function renderUrlset(
  origin: string,
  entries: readonly SitemapEntry[],
): string {
  const urls = entries.map((entry) => renderEntry(origin, entry)).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function renderSitemapIndex(
  origin: string,
  paths: readonly string[],
  lastmod = new Date().toISOString(),
): string {
  const entries = paths
    .map(
      (path) =>
        `  <sitemap>\n    <loc>${xmlEscape(siteUrl(origin, path))}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>
`;
}

/**
 * Serve a sitemap or `robots.txt`.
 *
 * These are the only responses on the site that may be cached publicly. Every
 * page document embeds the SSR'd navbar and is therefore per-visitor, which is
 * why the route `headers` elsewhere in this app all say `private, no-store`.
 * These bodies are built from cookie-free reads, so a shared cache holding one
 * copy for everyone is correct -- and it keeps a crawler's repeated fetches off
 * the API.
 */
export function xmlResponse(body: string, maxAge = 3600): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": `public, max-age=${maxAge}, s-maxage=${maxAge}, stale-while-revalidate=86400`,
    },
  });
}

export function textResponse(body: string, maxAge = 3600): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": `public, max-age=${maxAge}, s-maxage=${maxAge}`,
    },
  });
}
