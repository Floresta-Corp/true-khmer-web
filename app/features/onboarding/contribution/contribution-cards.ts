import {
  BriefcaseBusiness,
  CalendarDays,
  Heart,
  MessageCircleQuestion,
  Search,
  type LucideIcon,
  Users,
} from "lucide-react";

export const contributionIconByKey = {
  ask_questions: MessageCircleQuestion,
  find_answers: Search,
  recruit_volunteer: Users,
  post_project: BriefcaseBusiness,
  organize_event: CalendarDays,
  basic_activities: Heart,
} as const satisfies Record<string, LucideIcon>;

export type ContributionIconKey = keyof typeof contributionIconByKey;

export const contributionIconKeys = Object.keys(
  contributionIconByKey,
) as ContributionIconKey[];

export type ContributionCard = {
  id: string;
  title: string;
  description: string;
  iconKey: ContributionIconKey;
};

type ContributionOption = {
  id: string;
  name: string;
  description?: string;
  iconKey?: string;
};

const fallbackCards: Array<{
  iconKey: ContributionIconKey;
  description: string;
}> = [
  {
    iconKey: "ask_questions",
    description:
      "Ask questions in the forum and get practical help from the community.",
  },
  {
    iconKey: "find_answers",
    description:
      "Discover answers from existing discussions and community tips.",
  },
  {
    iconKey: "recruit_volunteer",
    description: "Post for volunteer opportunities and make direct impact.",
  },
  {
    iconKey: "post_project",
    description:
      "Launch projects and recruit talented collaborators to your team.",
  },
  {
    iconKey: "organize_event",
    description:
      "Host events and connect the Khmer community around shared goals.",
  },
  {
    iconKey: "basic_activities",
    description: "Browse, react, and support members across the platform.",
  },
];

function isContributionIconKey(value: string): value is ContributionIconKey {
  return Object.prototype.hasOwnProperty.call(contributionIconByKey, value);
}

export function mapContributionOptionsToCards(
  options: ContributionOption[],
): ContributionCard[] {
  return options.map((item, index) => {
    const fallback =
      fallbackCards[index % fallbackCards.length] ?? fallbackCards[0];
    const rawIconKey = item.iconKey ?? "";
    const iconKey: ContributionIconKey = isContributionIconKey(rawIconKey)
      ? rawIconKey
      : fallback.iconKey;

    return {
      id: item.id,
      title: item.name,
      description:
        item.description ||
        fallback.description ||
        "Select this contribution area to personalize your experience.",
      iconKey,
    };
  });
}
