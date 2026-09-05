import { Link } from "react-router";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { cn } from "~/lib/utils";
import { formatRemaining } from "~/features/my-classes/lib/format";
import type { MyClass } from "~/features/my-classes/types";
import { MyClassActionsMenu } from "./my-class-actions-menu";

function destinationFor(course: MyClass) {
  return course.isEnrolled
    ? `/education/${course.courseId}`
    : `/education/${course.courseId}`;
}

function CourseCover({ course }: { course: MyClass }) {
  if (course.coverImageUrl) {
    return (
      <img
        src={course.coverImageUrl}
        alt=""
        loading="lazy"
        className="size-full object-cover"
      />
    );
  }

  return (
    <div className="flex size-full items-center justify-center bg-[#EFF6FF] text-[#93B4EE]">
      <BookOpen size={22} aria-hidden />
    </div>
  );
}

export function MyClassRow({ course }: { course: MyClass }) {
  const remaining = formatRemaining(course);
  const isComplete = course.status === "completed";
  const hasLessons = course.lessonCount > 0;
  const to = `/education/${course.courseId}`;

  return (
    <div className="flex items-start gap-4 px-4 py-4 transition-colors hover:bg-[#fafbfc] sm:px-5">
      <Link
        to={to}
        tabIndex={-1}
        aria-hidden
        className="h-13.5 w-24 shrink-0 overflow-hidden rounded-lg bg-[#f1f5f9] sm:h-14.5 sm:w-26"
      >
        <CourseCover course={course} />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-bold tracking-[0.08em] text-[#9CA3AF] uppercase">
          {course.categoryName ?? "Course"}
        </div>

        <Link
          to={to}
          className="mt-0.5 block truncate text-[15px] font-bold text-[#1A1A2E] hover:text-[#1C5DD4] hover:underline"
        >
          {course.title}
        </Link>

        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#8A94A6]">
          <span>
            {hasLessons
              ? `${course.lessonsCompleted}/${course.lessonCount} lessons`
              : "No lessons yet"}
          </span>
          {course.instructor && (
            <>
              <span aria-hidden>·</span>
              <span className="truncate">By {course.instructor.name}</span>
            </>
          )}
        </div>

        {hasLessons && course.isEnrolled && (
          <div className="mt-2.5 max-w-md">
            <div
              role="progressbar"
              aria-valuenow={course.progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${course.title} progress`}
              className="h-1.5 w-full overflow-hidden rounded-full bg-[#e8edf3]"
            >
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  isComplete ? "bg-[#1FC16B]" : "bg-[#1C5DD4]",
                )}
                style={{ width: `${course.progressPercent}%` }}
              />
            </div>

            <div className="mt-1.5 flex items-center gap-2 text-xs">
              <span
                className={cn(
                  "font-bold",
                  isComplete ? "text-[#1FC16B]" : "text-[#1C5DD4]",
                )}
              >
                {course.progressPercent}%
              </span>
              {isComplete ? (
                <span className="inline-flex items-center gap-1 text-[#1FC16B]">
                  <CheckCircle2 size={13} aria-hidden />
                  Completed
                </span>
              ) : (
                remaining && <span className="text-[#8A94A6]">{remaining}</span>
              )}
            </div>
          </div>
        )}

        {!course.isEnrolled && (
          <div className="mt-2 text-xs font-semibold text-[#1C5DD4]">
            Saved — not started
          </div>
        )}
      </div>

      <MyClassActionsMenu course={course} />
    </div>
  );
}
