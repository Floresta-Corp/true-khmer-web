import { useMatches } from "react-router";
import type { SavedOnboardingProfile } from "~/services/onboarding.server";

type OnboardingProfileLayoutData = {
  savedProfile?: SavedOnboardingProfile;
  onboardingState?: { raw?: { user?: { email?: string } } };
};

function hasOnboardingLayoutHandle(
  handle: unknown,
): handle is { onboardingLayout?: boolean } {
  return (
    !!handle &&
    typeof handle === "object" &&
    (handle as { onboardingLayout?: boolean }).onboardingLayout === true
  );
}

export function useOnboardingProfileLayoutData(): OnboardingProfileLayoutData {
  const matches = useMatches();
  const onboardingLayoutMatch = matches.find((match) =>
    hasOnboardingLayoutHandle(match.handle),
  );

  return (onboardingLayoutMatch?.data ?? {}) as OnboardingProfileLayoutData;
}
