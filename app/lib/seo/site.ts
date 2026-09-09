/**
 * Site-wide identity every meta descriptor, canonical URL and JSON-LD block is
 * built from. One place so a rename or a new social account does not have to be
 * chased through a hundred route files.
 */
export const SITE = {
  name: "True Khmer",
  tagline: "Unleashing the Potential of Cambodia",
  description:
    "The leading community platform for Khmer business and career growth — bridging the gap between talent and opportunity worldwide.",
  /** og:locale. The platform publishes in English with Khmer content alongside. */
  locale: "en_US",
  localeAlternates: ["km_KH"],
  /** Served from `public/`, so these are origin-relative. */
  logoPath: "/logofullcolor.svg",
  ogImagePath: "/og-default.jpg",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  /** Feeds `sameAs` on the Organization entity, which is how search engines
      tie the site to its verified social profiles. */
  socialProfiles: [
    "https://www.facebook.com/truekhmerofficial",
    "https://www.tiktok.com/@truekhmerofficial",
    "https://www.youtube.com/@TrueKhmerofficial",
    "https://www.linkedin.com/company/truekhmerofficial",
  ],
} as const;

/** Longest description that survives a Google snippet or an OG card intact. */
export const META_DESCRIPTION_MAX = 160;

/** Titles longer than this are truncated in the SERP; the suffix counts. */
export const META_TITLE_MAX = 60;
