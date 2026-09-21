type PrivateRule = {
  path: string;

  match: RegExp;
};

function prefix(path: string): PrivateRule {
  return { path, match: new RegExp(`^${path}(/|$)`, "i") };
}

function exact(path: string): PrivateRule {
  return { path: `${path}$`, match: new RegExp(`^${path}/?$`, "i") };
}

function glob(path: string, match: RegExp): PrivateRule {
  return { path, match };
}

export const PRIVATE_RULES: readonly PrivateRule[] = [
  prefix("/tk-admin"),

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

  prefix("/education/create"),
  glob("/education/*/edit", /^\/education\/[^/]+\/edit(\/|$)/i),
  glob("/education/*/learn", /^\/education\/[^/]+\/learn(\/|$)/i),
  glob("/education/*/quiz", /^\/education\/[^/]+\/quiz(\/|$)/i),
  glob("/education/*/certificate", /^\/education\/[^/]+\/certificate(\/|$)/i),
  prefix("/volunteer/create"),
  prefix("/volunteer/edit"),
  prefix("/launchpad/create"),
  prefix("/launchpad/edit"),

  prefix("/registration/partner-registration/choose-package"),
  prefix("/registration/successfully"),

  prefix("/api"),
];

export const NOINDEX_RULES: readonly PrivateRule[] = [prefix("/forum/search")];

function normalise(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

export function isPrivatePath(pathname: string): boolean {
  const path = normalise(pathname);
  return [...PRIVATE_RULES, ...NOINDEX_RULES].some((rule) =>
    rule.match.test(path),
  );
}

export const CRAWLABLE_SECTIONS = [
  "/",
  "/about",
  "/khmer-voices",
  "/community",
  "/education",
  "/events",
  "/forum",
  "/launchpad",
  "/poc",
  "/volunteer",
] as const;

export const SITEMAP_PATHS = [
  "/sitemap-pages.xml",
  "/sitemap-blog.xml",
  "/sitemap-events.xml",
  "/sitemap-education.xml",
  "/sitemap-volunteer.xml",
  "/sitemap-launchpad.xml",
  "/sitemap-community.xml",
] as const;
