/**
 * Member tier ladder, ordered from lowest to highest rank.
 *
 * Slugs must stay in sync with the backend tier slugs (see the `tier` filter
 * enum on the admin user list endpoint). Names are only a fallback for screens
 * that have no tier payload to read from — prefer the `tier.name` returned by
 * the API whenever it is available.
 */
export const MEMBER_TIERS = [
  { slug: "dam", name: "Dam", khmerName: "ដាំ", meaning: "To plant" },
  { slug: "doh", name: "Doh", khmerName: "ដុះ", meaning: "To sprout" },
  {
    slug: "loas_sleuk",
    name: "Loas Sleuk",
    khmerName: "លាស់ស្លឹក",
    meaning: "New leaves",
  },
  {
    slug: "phka_reek",
    name: "Phka Reek",
    khmerName: "ផ្ការីក",
    meaning: "In bloom",
  },
  {
    slug: "preksa",
    name: "Preksa",
    khmerName: "ព្រឹក្សា",
    meaning: "The great tree",
  },
] as const;

export type MemberTier = (typeof MEMBER_TIERS)[number];
export type MemberTierSlug = MemberTier["slug"];

/** Tier every member starts on right after signing up. */
export const STARTING_MEMBER_TIER = MEMBER_TIERS[0];
