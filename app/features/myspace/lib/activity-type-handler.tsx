import {
  MessageCircle,
  ThumbsUp,
  Bookmark,
  Trash2,
  Heart,
  Award,
  Lightbulb,
  CheckCircle,
  Rocket,
  type LucideIcon,
  ThumbsDown,
} from "lucide-react";
import type { RecentActivityType } from "~/services/myspace/types/myspace-me-type";

export interface ActivityTypeConfig {
  icon: LucideIcon;
  bgColor: string;
  iconColor: string;
  label: string;
}

export const getActivityTypeConfig = (
  type: RecentActivityType,
): ActivityTypeConfig => {
  const configs: Record<RecentActivityType, ActivityTypeConfig> = {
    forum_question_posted: {
      icon: MessageCircle,
      bgColor: "#eff6ff",
      iconColor: "#3b82f6",
      label: "Posted a question",
    },
    forum_question_deleted: {
      icon: Trash2,
      bgColor: "#fef2f2",
      iconColor: "#ef4444",
      label: "Deleted a question",
    },
    forum_question_upvoted: {
      icon: ThumbsUp,
      bgColor: "#f0fdf4",
      iconColor: "#10b981",
      label: "Upvoted a question",
    },
    forum_question_downvoted: {
      icon: ThumbsDown,
      bgColor: "#fef2f2",
      iconColor: "#ef4444",
      label: "Downvoted a question",
    },
    forum_question_saved: {
      icon: Bookmark,
      bgColor: "#fffbeb",
      iconColor: "#f59e0b",
      label: "Saved a question",
    },
    forum_answer_posted: {
      icon: MessageCircle,
      bgColor: "#eff6ff",
      iconColor: "#3b82f6",
      label: "Posted an answer",
    },
    forum_answer_deleted: {
      icon: Trash2,
      bgColor: "#fef2f2",
      iconColor: "#ef4444",
      label: "Deleted an answer",
    },
    forum_answer_upvoted: {
      icon: ThumbsUp,
      bgColor: "#f0fdf4",
      iconColor: "#10b981",
      label: "Upvoted an answer",
    },
    forum_answer_downvoted: {
      icon: ThumbsDown,
      bgColor: "#fef2f2",
      iconColor: "#ef4444",
      label: "Downvoted an answer",
    },
    forum_best_answer_marked: {
      icon: Award,
      bgColor: "#fef3c7",
      iconColor: "#eab308",
      label: "Marked best answer",
    },
    volunteer_opportunity_posted: {
      icon: Rocket,
      bgColor: "#eff6ff",
      iconColor: "#3b82f6",
      label: "Posted opportunity",
    },
    volunteer_opportunity_saved: {
      icon: Bookmark,
      bgColor: "#fffbeb",
      iconColor: "#f59e0b",
      label: "Saved opportunity",
    },
    volunteer_application_submitted: {
      icon: CheckCircle,
      bgColor: "#f0fdf4",
      iconColor: "#10b981",
      label: "Submitted application",
    },
    launchpad_created: {
      icon: Lightbulb,
      bgColor: "#eff6ff",
      iconColor: "#3b82f6",
      label: "Created initiative",
    },
  };

  return configs[type];
};

export const getActivityIconColor = (type: RecentActivityType): string => {
  return getActivityTypeConfig(type).iconColor;
};
