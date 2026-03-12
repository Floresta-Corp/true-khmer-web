import { useMatches } from "react-router";
import type { SavedOnboardingContributions } from "~/services/onboarding.server";

type OnboardingContributionLayoutData = {
  savedContributions?: SavedOnboardingContributions;
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

export function useOnboardingContributionLayoutData(): OnboardingContributionLayoutData {
  const matches = useMatches();
  const onboardingLayoutMatch = matches.find((match) =>
    hasOnboardingLayoutHandle(match.handle),
  );

  return (onboardingLayoutMatch?.data ??
    {}) as OnboardingContributionLayoutData;
}
