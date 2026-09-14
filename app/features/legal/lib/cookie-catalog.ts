/**
 * The third-party inventory the Cookie Policy renders.
 *
 * True Khmer's own cookies are not listed here: every one of them is strictly
 * necessary — the session cookies in `app/lib/server/session.server.ts` — and
 * the page describes them in prose rather than tabulating them. What does need
 * a table is the content we load from other companies, because a reader cannot
 * discover that from anything we control.
 *
 * The day an optional cookie is introduced, this file grows a second list and
 * the page grows the consent controls that go with it.
 */

export type CookieEntry = {
  name: string;
  provider: string;
  purpose: string;
  duration: string;
};

/**
 * Content loaded from other companies, which sets its own cookies once the page
 * containing it is open. Listed separately because it is outside our control —
 * only not loading the page, or blocking third-party content in the browser,
 * stops it.
 */
export const THIRD_PARTY_EMBEDS: CookieEntry[] = [
  {
    name: "YouTube",
    provider: "Google",
    purpose:
      "Plays the video lessons embedded in courses. Loads only on a page containing a video, and sets cookies under Google's own policy.",
    duration: "Set by Google",
  },
  {
    name: "Google Sign-In",
    provider: "Google",
    purpose:
      "Used only if you choose to sign in or register with Google, and only during that flow.",
    duration: "Set by Google",
  },
  {
    name: "Plumpi",
    provider: "Plumpi Events",
    purpose:
      "Handles ticketing and registration for events that use it, once you continue to that service.",
    duration: "Set by Plumpi",
  },
  {
    name: "Cloudflare",
    provider: "Cloudflare",
    purpose:
      "Protects the Platform against attacks and abuse, and may set a security cookie when a request looks automated.",
    duration: "Set by Cloudflare",
  },
];

/** The four columns both tables are rendered with. */
export const COOKIE_TABLE_COLUMNS = ["Cookie", "Set by", "Purpose", "Expires"];

export function cookieRows(entries: CookieEntry[]): string[][] {
  return entries.map((entry) => [
    entry.name,
    entry.provider,
    entry.purpose,
    entry.duration,
  ]);
}
