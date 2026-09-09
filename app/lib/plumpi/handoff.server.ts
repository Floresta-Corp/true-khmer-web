import {
  buildPlumpiHandoffUrl,
  createPlumpiHandoff,
} from "~/api/events/events.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";

/**
 * Shared "hand the visitor over to Plumpi" step.
 *
 * Every crossing works the same way — mint a short-lived, single-use handoff
 * token, then send the already-opened tab to Plumpi's sign-in URL with the
 * destination attached. Only the destination differs (the organizer console
 * for the workspace, the order page for a ticket), so callers pass their own
 * `nextPath` and everything else lives here.
 */

/** The token is single-use and short-lived, so the URL must never be cached. */
export const PLUMPI_HANDOFF_RESPONSE_INIT = {
  headers: { "Cache-Control": "private, no-store" },
} satisfies ResponseInit;

export class ExpiredPlumpiHandoffError extends Error {
  constructor() {
    super("The Plumpi handoff token expired before redirect.");
    this.name = "ExpiredPlumpiHandoffError";
  }
}

export function plumpiHandoffErrorMessage(error: unknown) {
  if (error instanceof ExpiredPlumpiHandoffError) {
    return "The secure Plumpi link expired before it could be opened. Please try again.";
  }

  if (!(error instanceof ProtectedApiError)) {
    return "Plumpi could not be opened automatically. Please try again.";
  }

  if (error.status === 409) {
    return "This Plumpi account is already connected to another True Khmer account.";
  }
  if (error.status === 403) {
    return "Your Plumpi account cannot be connected. Check your account access and try again.";
  }
  if (error.status === 503) {
    return "Plumpi is temporarily unavailable. Please try again later.";
  }
  if (error.status >= 500) {
    return "Plumpi could not be opened right now. Please try again shortly.";
  }

  return error.message;
}

/**
 * Mints a handoff token and returns the Plumpi URL that lands on `nextPath`
 * (a path inside Plumpi). Any `Set-Cookie` from the refreshed session is
 * pushed onto `cookies`.
 */
export async function resolvePlumpiHandoffUrl(
  request: Request,
  nextPath: string,
  cookies: string[],
) {
  const handoff = await createPlumpiHandoff(request);
  if (handoff.setCookie) cookies.push(handoff.setCookie);

  if (Date.now() >= new Date(handoff.data.expiresAt).getTime()) {
    throw new ExpiredPlumpiHandoffError();
  }

  return buildPlumpiHandoffUrl(nextPath, handoff.data.token);
}
