export type OnboardingContributionKey =
  | "community_member"
  | "find_volunteers"
  | "launch_project"
  | "organize_event";

export type OnboardingContributionCardLayout = "featured" | "default";

export type OnboardingContributionIconKey = OnboardingContributionKey;

export type OnboardingContributionOption = {
  key: OnboardingContributionKey;
  title: string;
  description: string;
  iconKey: OnboardingContributionIconKey;
  layout: OnboardingContributionCardLayout;
};

export const onboardingContributionOptions: OnboardingContributionOption[] = [
  {
    key: "community_member",
    title: "Basic Activities",
    description:
      "Browse events, join projects, search and apply for volunteering opportunities, engage in community discussions, and earn points along the way.",
    iconKey: "community_member",
    layout: "featured",
  },
  {
    key: "find_volunteers",
    title: "Find Volunteers",
    description:
      "Post opportunities and find passionate people ready to give their time to your cause.",
    iconKey: "find_volunteers",
    layout: "default",
  },
  {
    key: "launch_project",
    title: "Launch a Project",
    description:
      "Build something meaningful and find the right people to build it with.",
    iconKey: "launch_project",
    layout: "default",
  },
  {
    key: "organize_event",
    title: "Organize Event",
    description:
      "Create events and connect the Khmer community around shared goals.",
    iconKey: "organize_event",
    layout: "default",
  },
];

export const onboardingContributionOptionKeys = onboardingContributionOptions.map(
  (option) => option.key,
);

export const maxContributionSelections = onboardingContributionOptionKeys.length;
