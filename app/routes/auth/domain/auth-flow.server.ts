import {
  routeForAuthFlow,
  type AuthFlow,
} from "~/lib/server/auth/access-control.server";
import { isOAuthResumeRedirect } from "~/lib/redirects";

export function destinationFromAuthFlow(
  authFlow: AuthFlow | undefined,
  fallback = "/",
) {
  return routeForAuthFlow(authFlow, fallback);
}

// Auth started from the OAuth authorization page goes straight back there: the
// client app is waiting on the consent step, so onboarding has to wait its
// turn. Every other sign-in follows whatever the auth flow asks for next.
export function destinationAfterAuth(
  authFlow: AuthFlow | undefined,
  redirectTo: string,
) {
  return isOAuthResumeRedirect(redirectTo)
    ? redirectTo
    : destinationFromAuthFlow(authFlow, redirectTo);
}
