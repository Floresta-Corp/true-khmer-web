import type { CourseStatsResponse } from "~/api/education/education.server";
import { resolveImageURL } from "~/lib/utils";
import {
  MANAGE,
  type CourseManageAnalytics,
  type CourseManageOverview,
  type FunnelStage,
  type ManageStudent,
  type ProgressSegment,
} from "~/features/course-manage/types";

type Stats = CourseStatsResponse["stats"];

const EMPTY_STATS: Stats = {
  lessonCount: 0,
  students: [],
  enrollmentTrend: [],
};

function percent(part: number, total: number) {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

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

function shortDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${day} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

function split(stats: Stats) {
  const completed = stats.students.filter(
    (student) => student.completedAt !== null,
  ).length;
  return {
    total: stats.students.length,
    completed,
    inProgress: stats.students.length - completed,
  };
}

function progressSegments(stats: Stats): ProgressSegment[] {
  const { total, completed, inProgress } = split(stats);
  return [
    {
      key: "notStarted",
      label: "Not started",
      learners: 0,
      percent: 0,
      color: MANAGE.primary100,
    },
    {
      key: "inProgress",
      label: "In progress",
      learners: inProgress,
      percent: percent(inProgress, total),
      color: MANAGE.accent,
    },
    {
      key: "completed",
      label: "Completed",
      learners: completed,
      percent: percent(completed, total),
      color: MANAGE.success,
    },
  ];
}

export function buildManageOverview(stats: Stats | null): CourseManageOverview {
  const source = stats ?? EMPTY_STATS;
  const { total, completed } = split(source);

  return {
    lessonCount: source.lessonCount,
    enrollments: total,
    totalLearners: total,
    completionRate: percent(completed, total),
    progress: progressSegments(source),
    performance: [],
    quizPassRate: 0,
    avgQuizScore: 0,
    rating: 0,
    reviewCount: 0,
  };
}

export function buildStudents(stats: Stats | null): ManageStudent[] {
  const source = stats ?? EMPTY_STATS;

  return source.students
    .slice()
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
    .map((student) => {
      const done = student.completedAt !== null;
      return {
        id: student.userId,
        name: student.name,
        avatarUrl: student.avatar ? resolveImageURL(student.avatar) : null,
        enrolledAt: student.startedAt,
        progressPercent: percent(student.lessonsCompleted, source.lessonCount),
        status: done ? ("completed" as const) : ("in-progress" as const),
        quizScore: "—",
        completedLabel: student.completedAt
          ? shortDate(student.completedAt)
          : "—",
      };
    });
}

export function buildAnalytics(stats: Stats | null): CourseManageAnalytics {
  const source = stats ?? EMPTY_STATS;
  const { total, completed, inProgress } = split(source);

  const funnel: FunnelStage[] =
    total === 0
      ? []
      : (
          [
            { label: "Started", learners: total, color: MANAGE.brand },
            {
              label: "In progress",
              learners: inProgress,
              color: MANAGE.warning,
            },
            { label: "Completed", learners: completed, color: MANAGE.success },
          ] as const
        ).map((stage, index) => ({
          label: stage.label,
          learners: stage.learners,
          percent: percent(stage.learners, total),
          color: stage.color,
          fillOpacity: 1 - index * 0.1,
        }));

  return {
    trend: source.enrollmentTrend.map((point) => ({
      label: shortDate(point.date),
      value: point.learners,
    })),
    funnel,
    quizBands: [],
    quizAttempts: 0,
  };
}
