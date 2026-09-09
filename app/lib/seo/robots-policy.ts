/**
 * The single list of URLs search engines must not index, used twice:
 * `/robots.txt` renders the `Disallow` lines from it, and the server entry
 * stamps `X-Robots-Tag: noindex` on the matching responses.
 *
 * Both are needed and they do different jobs. `robots.txt` stops the crawl,
 * but a URL that is only disallowed can still be listed from inbound links
 * alone — and a disallowed page can never be read, so a `<meta robots>` tag on
 * it would never be seen. The header is what actually removes a page from the
 * index, and it arrives on every response without touching a hundred route
 * files.
 */
type PrivateRule = {
  /** The `Disallow` value, in robots.txt path syntax (`*` and `$` allowed). */
  path: string;
  /** The same rule as a matcher, for the response header. */
  match: RegExp;
};

/** `Disallow: /workspace` already covers `/workspace/manage-post`. */
function prefix(path: string): PrivateRule {
  return { path, match: new RegExp(`^${path}(/|$)`, "i") };
}

/** For a path that is private only exactly as written — `/profile` is the
    onboarding form, while `/profile/:id` is a public member page. */
function exact(path: string): PrivateRule {
  return { path: `${path}$`, match: new RegExp(`^${path}/?$`, "i") };
}

function glob(path: string, match: RegExp): PrivateRule {
  return { path, match };
}

export const PRIVATE_RULES: readonly PrivateRule[] = [
  // Staff and moderation tooling.
  prefix("/tk-admin"),

  // Signed-in areas: a member's own space, an organizer's workspace.
  prefix("/myspace"),
  prefix("/my-applications"),
  prefix("/my-classes"),
  prefix("/my-ticket"),
  prefix("/my-events"),
  prefix("/saved-items"),
  prefix("/edit-profile"),
  prefix("/workspace"),
  prefix("/course-listing"),
  prefix("/settings"),
  prefix("/notifications"),
  prefix("/messages"),
  prefix("/dashboard"),
  exact("/profile"),

  // Authentication and account setup. Nothing here is a landing page, and an
  // indexed login form competes with the page a searcher actually wanted.
  prefix("/login"),
  prefix("/register"),
  prefix("/signup"),
  prefix("/complete-signup"),
  prefix("/forgot-password"),
  prefix("/reset-password"),
  prefix("/verify-otp"),
  prefix("/logout"),
  prefix("/onboarding"),
  prefix("/oauth"),

  // Authoring and learner-only screens inside otherwise public sections.
  prefix("/education/create"),
  glob("/education/*/edit", /^\/education\/[^/]+\/edit(\/|$)/i),
  glob("/education/*/learn", /^\/education\/[^/]+\/learn(\/|$)/i),
  glob("/education/*/quiz", /^\/education\/[^/]+\/quiz(\/|$)/i),
  glob("/education/*/certificate", /^\/education\/[^/]+\/certificate(\/|$)/i),
  prefix("/volunteer/create"),
  prefix("/volunteer/edit"),
  prefix("/launchpad/create"),
  prefix("/launchpad/edit"),

  // Mid-funnel registration steps. The `/registration` landing page stays
  // crawlable; the package picker and the receipt are not entry points.
  prefix("/registration/partner-registration/choose-package"),
  prefix("/registration/successfully"),

  // Resource routes returning JSON, streams and presigned uploads.
  prefix("/api"),
];

/**
 * Crawlable, but never indexed.
 *
 * Search results are a reshuffle of content that already has its own canonical
 * URL, so they must not rank -- but they cannot simply be disallowed either:
 * the sitelinks search box Google may show under the brand result is declared
 * against `/forum/search`, and Google has to be able to fetch that URL to
 * honour it. `noindex` without `Disallow` is exactly the tool for that, and it
 * is also why these rules are kept apart from the private ones: a `Disallow`ed
 * page is never fetched, so a `noindex` on it would never be read.
 */
export const NOINDEX_RULES: readonly PrivateRule[] = [prefix("/forum/search")];

function normalise(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

/** Whether a pathname should carry `X-Robots-Tag: noindex, nofollow`. */
export function isPrivatePath(pathname: string): boolean {
  const path = normalise(pathname);
  return [...PRIVATE_RULES, ...NOINDEX_RULES].some((rule) =>
    rule.match.test(path),
  );
}

/** The public sections a sitemap covers, for the `Allow` lines. */
export const CRAWLABLE_SECTIONS = [
  "/",
  "/about",
  "/blog",
  "/community",
  "/education",
  "/events",
  "/forum",
  "/launchpad",
  "/poc",
  "/volunteer",
] as const;

/**
 * Every sitemap the index stitches together. Split by section so one failing
 * upstream leaves the rest crawlable, and so each stays well inside the
 * 50,000-URL / 50 MB limit as the platform grows.
 */
export const SITEMAP_PATHS = [
  "/sitemap-pages.xml",
  "/sitemap-blog.xml",
  "/sitemap-events.xml",
  "/sitemap-education.xml",
  "/sitemap-volunteer.xml",
  "/sitemap-launchpad.xml",
  "/sitemap-community.xml",
] as const;
