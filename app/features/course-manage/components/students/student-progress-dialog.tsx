import { useEffect } from "react";
import { useFetcher } from "react-router";
import { Check, Circle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { cn } from "~/lib/utils";
import type { CourseStudentDetailResponse } from "~/api/education/education.server";

type Student = CourseStudentDetailResponse["student"];

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

/** "02 Mar 2026", read in UTC so the day cannot shift west of Greenwich. */
function formatDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${day} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** Lessons grouped under their chapter, in curriculum order. */
function byChapter(lessons: Student["lessons"]) {
  const groups: { title: string; lessons: Student["lessons"] }[] = [];
  for (const lesson of lessons) {
    const last = groups[groups.length - 1];
    if (last && last.title === lesson.chapterTitle) last.lessons.push(lesson);
    else groups.push({ title: lesson.chapterTitle, lessons: [lesson] });
  }
  return groups;
}

/**
 * One learner's lesson-by-lesson progress and quiz history.
 *
 * Fetched on open rather than with the roster: the detail is only ever wanted
 * for one learner at a time, and bundling it into the table's payload would
 * multiply it by the page size.
 */
export function StudentProgressDialog({
  courseId,
  userId,
  onClose,
}: {
  courseId: string;
  userId: string | null;
  onClose: () => void;
}) {
  const fetcher = useFetcher<CourseStudentDetailResponse>();

  useEffect(() => {
    if (!userId) return;
    fetcher.load(`/course-listing/${courseId}/students/${userId}`);
    // Deliberately keyed on the learner alone; `fetcher` is stable.
  }, [courseId, userId]);

  const student = fetcher.data?.student;
  const loading = fetcher.state !== "idle";
  const completed = student?.lessons.filter((l) => l.completedAt).length ?? 0;

  return (
    <Dialog open={userId !== null} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="text-[17px] font-bold text-[#1A1A2E]">
            {student?.name ?? "Student progress"}
          </DialogTitle>
          <DialogDescription className="text-[13px] text-[#9A9AB0]">
            {student
              ? `${student.email} · joined ${formatDate(student.enrolledAt) ?? "—"}`
              : "Loading this learner's progress…"}
          </DialogDescription>
        </DialogHeader>

        {loading && !student && (
          <p className="py-8 text-center text-[13px] text-[#9A9AB0]">
            Loading…
          </p>
        )}

        {!loading && !student && (
          <p className="py-8 text-center text-[13px] text-[#9A9AB0]">
            This learner&rsquo;s progress could not be loaded.
          </p>
        )}

        {student && (
          <div className="flex flex-col gap-5">
            <p className="text-[13px] font-semibold text-[#333333]">
              {completed} of {student.lessons.length} lessons complete
            </p>

            <div className="flex flex-col gap-4">
              {byChapter(student.lessons).map((chapter) => (
                <div key={chapter.title}>
                  <h4 className="mb-2 text-[13px] font-bold text-[#1A1A2E]">
                    {chapter.title}
                  </h4>
                  <ul className="flex flex-col gap-1.5">
                    {chapter.lessons.map((lesson) => {
                      const done = Boolean(lesson.completedAt);
                      return (
                        <li
                          key={lesson.lessonId}
                          className="flex items-center gap-2.5 text-[13px]"
                        >
                          {done ? (
                            <Check
                              size={14}
                              strokeWidth={3}
                              aria-hidden
                              className="shrink-0 text-[#1FC16B]"
                            />
                          ) : (
                            <Circle
                              size={13}
                              aria-hidden
                              className="shrink-0 text-[#C6C6D4]"
                            />
                          )}
                          <span
                            className={cn(
                              "min-w-0 flex-1 truncate",
                              done ? "text-[#333333]" : "text-[#9A9AB0]",
                            )}
                          >
                            {lesson.title}
                          </span>
                          <span className="shrink-0 text-[12px] text-[#9A9AB0]">
                            {formatDate(lesson.completedAt) ?? "Not started"}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <div>
              <h4 className="mb-2 text-[13px] font-bold text-[#1A1A2E]">
                Quiz attempts
              </h4>
              {student.attempts.length === 0 ? (
                <p className="text-[13px] text-[#9A9AB0]">
                  This learner has not sat the quiz.
                </p>
              ) : (
                <ul className="flex flex-col gap-1.5">
                  {student.attempts.map((attempt) => (
                    <li
                      key={attempt.attemptedAt}
                      className="flex items-center gap-3 text-[13px]"
                    >
                      <span
                        className={cn(
                          "shrink-0 rounded-md px-2 py-0.5 text-[11.5px] font-semibold",
                          attempt.passed
                            ? "bg-[#E3F7ED] text-[#149A57]"
                            : "bg-[#F9E7E6] text-[#C93A32]",
                        )}
                      >
                        {attempt.passed ? "Passed" : "Failed"}
                      </span>
                      <span className="font-semibold text-[#1A1A2E]">
                        {attempt.percent}%
                      </span>
                      <span className="text-[#9A9AB0]">
                        {attempt.correctCount}/{attempt.totalCount} correct
                      </span>
                      <span className="ml-auto shrink-0 text-[12px] text-[#9A9AB0]">
                        {formatDate(attempt.attemptedAt) ?? "—"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
