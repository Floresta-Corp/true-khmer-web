import { z } from "zod";
import type { QuestionSortBy } from "~/features/forum/types";
import type { AnswerResponse } from "~/types/api-client";

export type RepliedAnswer = NonNullable<
  AnswerResponse["repliedAnswers"]
>[number];

export interface ForumAnswerModerationHandlers {
  onDelete: (answerId: string, isReply: boolean) => void;
  onSuspend: (answerId: string, reason: string, isReply: boolean) => void;
  onUnsuspend: (answerId: string, isReply: boolean) => void;
  isDeleting: boolean;
}

export const questionStatusFilterSchema = z.enum([
  "PUBLISHED",
  "CLOSED",
  "SUSPENDED",
  "DELETED",
]);
export type QuestionStatusFilter = z.infer<typeof questionStatusFilterSchema>;

export const launchpadStatusFilterSchema = z.enum([
  "DRAFT",
  "LIVE",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELED",
  "SUSPENDED",
  "DELETED",
]);
export type LaunchpadStatusFilter = z.infer<typeof launchpadStatusFilterSchema>;

export const volunteerStatusFilterSchema = z.enum([
  "DRAFT",
  "LIVE",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELED",
  "SUSPENDED",
  "DELETED",
]);
export type VolunteerStatusFilter = z.infer<typeof volunteerStatusFilterSchema>;

export function toStatusParam(status: string) {
  return status.toLowerCase();
}

export function fromStatusParam(value: string | null) {
  return value ? value.toUpperCase() : undefined;
}

export const answerSortBySchema = z.enum(["popular", "newest", "oldest"]);
export type AnswerSortBy = z.infer<typeof answerSortBySchema>;

export const ALL_CATEGORIES = "all-categories";
export const DEFAULT_SORT_BY: QuestionSortBy = "newest";

export const SORT_OPTIONS: { value: QuestionSortBy; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "mostVoted", label: "Most Voted" },
  { value: "mostAnswered", label: "Most Answered" },
];

export const STATUS_OPTIONS: { value: QuestionStatusFilter; label: string }[] =
  [
    { value: "PUBLISHED", label: "Published" },
    { value: "CLOSED", label: "Closed" },
    { value: "SUSPENDED", label: "Suspended" },
    { value: "DELETED", label: "Deleted" },
  ];

export const LAUNCHPAD_STATUS_OPTIONS: {
  value: LaunchpadStatusFilter;
  label: string;
}[] = [
  { value: "DRAFT", label: "Draft" },
  { value: "LIVE", label: "Live" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELED", label: "Canceled" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "DELETED", label: "Deleted" },
];

export const VOLUNTEER_STATUS_OPTIONS: {
  value: VolunteerStatusFilter;
  label: string;
}[] = [
  { value: "LIVE", label: "Live" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELED", label: "Canceled" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "DELETED", label: "Deleted" },
];
