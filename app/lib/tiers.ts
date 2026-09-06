/**
 * Member tier ladder, ordered from lowest to highest rank.
 *
 * Slugs must stay in sync with the backend tier slugs (see the `tier` filter
 * enum on the admin user list endpoint). Names are only a fallback for screens
 * that have no tier payload to read from — prefer the `tier.name` returned by
 * the API whenever it is available.
 */
export const MEMBER_TIERS = [
  { slug: "dam", name: "Dam" },
  { slug: "doh", name: "Doh" },
  { slug: "loas_sleuk", name: "Loas Sleuk" },
  { slug: "phka_reek", name: "Phka Reek" },
  { slug: "preksa", name: "Preksa" },
] as const;

export type MemberTierSlug = (typeof MEMBER_TIERS)[number]["slug"];

/** Tier every member starts on right after signing up. */
export const STARTING_MEMBER_TIER = MEMBER_TIERS[0];
