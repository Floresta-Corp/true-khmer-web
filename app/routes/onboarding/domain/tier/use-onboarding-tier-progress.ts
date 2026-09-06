import { useMatches } from "react-router";
import { MEMBER_TIERS } from "~/lib/tiers";
import type { OnboardingState } from "~/services/onboarding.server";

type OnboardingTierLayoutData = {
  onboardingState?: OnboardingState;
};

export type OnboardingTierProgress = {
  tierName: string;
  nextTierName: string | null;
  totalPoints: number;
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

export function useOnboardingTierProgress(): OnboardingTierProgress {
  const matches = useMatches();
  const onboardingLayoutMatch = matches.find((match) =>
    hasOnboardingLayoutHandle(match.handle),
  );

  const layoutData = (onboardingLayoutMatch?.data ??
    {}) as OnboardingTierLayoutData;
  const progress = layoutData.onboardingState?.raw?.progress;
  const tier = progress?.tier ?? null;

  // The ladder is only used to name the tier ahead; the current tier itself
  // always comes from the backend when it is present.
  const ladderIndex = Math.max(
    MEMBER_TIERS.findIndex((entry) => entry.slug === tier?.slug),
    0,
  );

  return {
    tierName: tier?.name ?? MEMBER_TIERS[ladderIndex].name,
    nextTierName: MEMBER_TIERS[ladderIndex + 1]?.name ?? null,
    totalPoints: progress?.totalPoints ?? 0,
  };
}
