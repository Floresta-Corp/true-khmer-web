/**
 * Links out to Plumpi, our event management partner.
 *
 * Everything past browsing — checkout, RSVP, check-in — lives on Plumpi, so
 * these build the public URLs we hand a visitor. They return `null` when
 * `VITE_PLUMPI_WEB` is not configured, which is how callers know to drop the
 * link rather than render a broken one.
 */

function plumpiWebBase(): string | null {
  return import.meta.env.VITE_PLUMPI_WEB?.trim() || null;
}

/** The event's public Plumpi page. */
export function buildPlumpiEventUrl(slug: string): string | null {
  const base = plumpiWebBase();
  if (!base) return null;

  return `${base}/events/${encodeURIComponent(slug)}`;
}

/**
 * Plumpi's order page with a tier preselected, e.g.
 * `/events/{slug}/order?ticketTierId={id}` — where "Select" on a ticket row
 * sends the visitor.
 */
export function buildPlumpiTicketOrderUrl(
  slug: string,
  ticketTierId: string,
): string | null {
  const eventUrl = buildPlumpiEventUrl(slug);
  if (!eventUrl) return null;

  return `${eventUrl}/order?ticketTierId=${encodeURIComponent(ticketTierId)}`;
}
