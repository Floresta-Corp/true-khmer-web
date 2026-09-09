import { z } from "zod";

/**
 * The workspace half of the Plumpi handoff: the intent both organizer entry
 * points post, and the console destination they hand over to. The crossing
 * itself is shared — see `~/lib/plumpi/handoff.server`.
 */

/**
 * Form intent that hands an existing event over to the Plumpi organizer
 * console. Shared by the create-event dialog and the My Events listing.
 */
export const PLUMPI_HANDOFF_INTENT = "continue-to-plumpi";

export const plumpiHandoffParamsSchema = z.object({
  intent: z.literal(PLUMPI_HANDOFF_INTENT),
  eventId: z.string().uuid(),
  organizationId: z.string().uuid(),
});

/**
 * Where in the Plumpi console the organizer lands: the event's own page.
 * A path rather than a URL, because the handoff carries it as `nextPath`.
 */
export function plumpiConsoleEventPath(
  organizationId: string,
  eventId: string,
) {
  return `/console/${encodeURIComponent(organizationId)}/events/${encodeURIComponent(eventId)}`;
}
