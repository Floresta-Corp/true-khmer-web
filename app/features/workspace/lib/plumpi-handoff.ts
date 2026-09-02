/**
 * Form intent that hands an existing event over to the Plumpi organizer
 * console. Shared by the create-event dialog and the My Events listing, and
 * kept out of `plumpi-handoff.server.ts` so components can import it.
 */
export const PLUMPI_HANDOFF_INTENT = "continue-to-plumpi";

/**
 * Copy for the hold shown while the handoff link is being minted. Kept here so
 * the in-app overlay and the interstitial written into the new tab always say
 * the same thing.
 */
export const PLUMPI_HANDOFF_TITLE = "Redirecting you to Plumpi…";
export const PLUMPI_HANDOFF_MESSAGE =
  "Hang tight while we take you to Plumpi to finish setup.";
