/**
 * Form intent that hands an existing event over to the Plumpi organizer
 * console. Shared by the create-event dialog and the My Events listing, and
 * kept out of `plumpi-handoff.server.ts` so components can import it.
 */
export const PLUMPI_HANDOFF_INTENT = "continue-to-plumpi";
