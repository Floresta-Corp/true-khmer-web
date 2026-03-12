import {
  BriefcaseBusiness,
  CalendarDays,
  Heart,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import {
  onboardingContributionOptions,
  type OnboardingContributionIconKey,
  type OnboardingContributionKey,
  type OnboardingContributionCardLayout,
} from "./contribution-options";

export const contributionIconByKey: Record<
  OnboardingContributionIconKey,
  LucideIcon
> = {
  community_member: UserRound,
  find_volunteers: Heart,
  launch_project: BriefcaseBusiness,
  organize_event: CalendarDays,
};

export type OnboardingContributionCard = {
  key: OnboardingContributionKey;
  title: string;
  description: string;
  icon: LucideIcon;
  layout: OnboardingContributionCardLayout;
};

export const onboardingContributionCards: OnboardingContributionCard[] =
  onboardingContributionOptions.map((option) => ({
    key: option.key,
    title: option.title,
    description: option.description,
    icon: contributionIconByKey[option.iconKey],
    layout: option.layout,
  }));
