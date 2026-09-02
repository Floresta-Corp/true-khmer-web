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

/**
 * The creator's course figures, derived from recorded lesson progress.
 *
 * What is real: learners, how far each has got, completion, and when learners
 * started. What is absent, because nothing records it: quiz attempts (so quiz
 * pass rate, average score and the score distribution) and ratings (so the
 * review distribution). Those stay at zero and their blocks render empty
 * rather than showing a figure nobody measured.
 *
 * One consequence of having no enrolment resource: a learner only exists here
 * once they open a lesson, so there is no "enrolled but not started" group and
 * `notStarted` is always zero.
 */

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

/**
 * "02 Sep 2026", matching the Students and Review tabs. Read in UTC for the
 * same reason they do — a local getter would roll the date back a day west of
 * Greenwich and disagree between the server and client renders.
 */
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
    // The design's "Course performance" chart plots enrollments against
    // active students per day. Nothing records activity, only completions,
    // so it stays empty; the Analytics tab's enrolment trend is the part
    // that is measurable.
    performance: [],
    // No quiz attempts and no ratings are stored anywhere.
    quizPassRate: 0,
    avgQuizScore: 0,
    rating: 0,
    reviewCount: 0,
  };
}

/** The Students tab's table, one row per learner with recorded progress. */
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
        // No quiz attempt is recorded, so there is no score to show.
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

  // "Enrolled" is deliberately absent: without an enrolment resource it would
  // be identical to "Started", so the funnel begins where the data does.
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
    // Nothing records quiz attempts.
    quizBands: [],
    quizAttempts: 0,
  };
}
