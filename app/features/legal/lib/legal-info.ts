/**
 * The facts every legal page repeats: who the operator is, how to reach them,
 * and when each document last changed.
 *
 * Kept in one place because these are the values most likely to be corrected
 * after a legal review, and a name or an address that disagrees with itself
 * across three pages undermines the documents it appears in.
 */
export const LEGAL = {
  /** The entity the documents are entered into with. */
  entity: "True Khmer",
  /** Shown wherever the operator has to be named in full. */
  entityLong: "True Khmer, operator of truekhmer.com",
  jurisdiction: "Kingdom of Cambodia",
  address: "Phnom Penh, Kingdom of Cambodia",
  contact: {
    general: "hello@truekhmer.com",
    privacy: "privacy@truekhmer.com",
    legal: "legal@truekhmer.com",
    moderation: "moderation@truekhmer.com",
  },
  /** Minimum age to hold an account, referenced by both documents. */
  minimumAge: 16,
  /** Days a deactivated account is kept before deletion, quoted in both the
      policy's retention section and the terms' termination section. */
  accountGraceDays: 30,
} as const;

/**
 * Each document carries its own date: amending the terms should not make the
 * privacy policy look freshly revised, which is exactly the signal a returning
 * reader uses to decide whether they need to read it again.
 */
export const LEGAL_UPDATED = {
  privacy: "2026-09-11",
  terms: "2026-09-11",
  cookies: "2026-09-11",
} as const;

/** `2026-09-11` -> `11 September 2026`, the form used in the page headers. */
export function formatLegalDate(iso: string): string {
  const parsed = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return iso;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}
