import { Outlet, type ShouldRevalidateFunctionArgs } from "react-router";
import type { Route } from "./+types/layout";
import {
  destinationFromOnboardingState,
  readSavedContributions,
  readSavedInterests,
  readSavedProfile,
} from "~/services/onboarding.server";
import {
  withAuthData,
  withAuthRedirect,
} from "~/lib/server/auth-response.server";
import { requireOnboarding } from "~/lib/server/route-guards.server";

export async function loader({ request }: Route.LoaderArgs) {
  const auth = await requireOnboarding(request);
  const url = new URL(request.url);
  const destination = destinationFromOnboardingState(auth.state);
  const referer = request.headers.get("referer");
  const refererPathname = (() => {
    if (!referer) return "";
    try {
      return new URL(referer).pathname;
    } catch {
      return "";
    }
  })();
  const cameFromOnboarding = refererPathname.startsWith("/onboarding");

  if (url.pathname === "/onboarding" && auth.state.currentStep > 1) {
    throw withAuthRedirect(auth, destination);
  }

  const isOnboardingStepPath =
    url.pathname === "/onboarding/profile" ||
    url.pathname === "/onboarding/interest" ||
    url.pathname === "/onboarding/contribution" ||
    url.pathname === "/onboarding/tier";

  // Resume behavior: when user re-enters onboarding from outside (or direct URL),
  // jump to their latest required step; keep in-flow back/next navigation untouched.
  if (
    isOnboardingStepPath &&
    url.pathname !== destination &&
    !cameFromOnboarding
  ) {
    throw withAuthRedirect(auth, destination);
  }

  const savedProfile = readSavedProfile(auth.state.raw);
  const savedInterests = readSavedInterests(auth.state.raw);
  const savedContributions = readSavedContributions(auth.state.raw);

  return withAuthData(auth, {
    onboardingState: auth.state,
    savedProfile,
    savedInterests,
    savedContributions,
  });
}

export function shouldRevalidate({
  currentUrl,
  nextUrl,
  formMethod,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  if (formMethod && formMethod.toUpperCase() !== "GET") {
    return true;
  }

  const isOnboardingNav =
    currentUrl.pathname.startsWith("/onboarding") &&
    nextUrl.pathname.startsWith("/onboarding");

  if (isOnboardingNav && currentUrl.search === nextUrl.search) {
    return false;
  }

  return defaultShouldRevalidate;
}

export default function OnboardingLayoutRoute() {
  return <Outlet />;
}

export const handle = {
  onboardingLayout: true,
};
