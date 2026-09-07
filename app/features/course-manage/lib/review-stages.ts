import type { MyCourse } from "~/features/course-listing/types";
import type { ReviewStage } from "~/features/course-manage/types";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function shortDate(date: Date) {
  return `${MONTHS[date.getMonth()]} ${String(date.getDate()).padStart(2, "0")}`;
}

function monthLabel(date: Date) {
  return MONTHS[date.getMonth()];
}

function longDate(date: Date) {
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${day} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export function buildReviewStages(course: MyCourse): ReviewStage[] {
  const rejected = Boolean(course.rejectedAt);
  const approved =
    course.status === "PUBLISHED" || course.status === "UNPUBLISHED";
  const pending = course.status === "PENDING";
  const live = course.status === "PUBLISHED";
  const submitted = pending || approved || rejected;

  const decided = course.rejectedAt
    ? longDate(new Date(course.rejectedAt))
    : course.publishedAt
      ? longDate(new Date(course.publishedAt))
      : "";

  return [
    {
      title: "Submitted",
      timestamp: submitted ? longDate(new Date(course.createdAt)) : "",
      state: submitted ? "done" : "todo",
    },
    {
      title: "In review",
      timestamp: pending ? "In progress" : decided,
      state: pending ? "current" : approved || rejected ? "done" : "todo",
    },
    {
      title: rejected ? "Not approved" : "Approved",
      timestamp: approved || rejected ? decided : "",
      state: rejected ? "rejected" : approved ? "done" : "todo",
    },
    {
      title: "Published",
      timestamp: live ? decided : "",
      state: live ? "done" : "todo",
    },
  ];
}
