import {
  routeForAuthFlow,
  type AuthFlow,
} from "~/lib/server/auth/access-control.server";

export function destinationFromAuthFlow(
  authFlow: AuthFlow | undefined,
  fallback = "/",
) {
  return routeForAuthFlow(authFlow, fallback);
}
