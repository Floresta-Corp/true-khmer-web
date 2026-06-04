import type { AuthFlow } from "~/services/auth.server";

export function destinationFromAuthFlow(
  authFlow: AuthFlow | undefined,
  fallback = "/",
) {
  switch (authFlow?.nextStep) {
    case "COMPLETE_SIGNUP":
      return "/complete-signup";
    case "ONBOARDING":
      return "/onboarding/profile";
    case "APP":
      return "/";
    default:
      return fallback;
  }
}
