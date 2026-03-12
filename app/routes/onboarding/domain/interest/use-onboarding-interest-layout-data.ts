import { useMatches } from "react-router";
import type { SavedOnboardingInterests } from "~/services/onboarding.server";

type OnboardingInterestLayoutData = {
  savedInterests?: SavedOnboardingInterests;
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

export function useOnboardingInterestLayoutData(): OnboardingInterestLayoutData {
  const matches = useMatches();
  const onboardingLayoutMatch = matches.find((match) =>
    hasOnboardingLayoutHandle(match.handle),
  );

  return (onboardingLayoutMatch?.data ?? {}) as OnboardingInterestLayoutData;
}
