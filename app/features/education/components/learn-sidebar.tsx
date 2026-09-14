import { Link } from "react-router";
import {
  Award,
  Check,
  ChevronDown,
  ChevronLeft,
  Lock,
  Menu,
  X,
} from "lucide-react";
import { cn } from "~/lib/utils";
import type { CourseDetail, CourseLesson } from "~/features/education/types";
import { LessonTypeIcon } from "./lesson-type-icon";
import { lessonDetail } from "~/features/education/lib/lesson-media";

interface LearnSidebarProps {
  course: CourseDetail;
  activeLessonId: string;
  completedLessonIds: Set<string>;
  /** Whether the learner has reached this lesson yet. */
  isLessonUnlocked: (lesson: CourseLesson) => boolean;
  openSectionIds: Set<string>;
  onToggleSection: (sectionId: string) => void;
  onClose: () => void;
  lessonIndex: (lesson: CourseLesson) => number;
  totalLessons: number;
  hasQuiz: boolean;
  quizUnlocked: boolean;
}

export function LearnSidebar({
  course,
  activeLessonId,
  completedLessonIds,
  isLessonUnlocked,
  openSectionIds,
  onToggleSection,
  onClose,
  lessonIndex,
  totalLessons,
  hasQuiz,
  quizUnlocked,
}: LearnSidebarProps) {
  const completedCount = completedLessonIds.size;
  const percent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const isFullyDone = totalLessons > 0 && completedCount === totalLessons;

  return (
    <div className="flex h-full w-95 shrink-0 flex-col border-r border-[#E5E7EB] bg-white">
      <div className="border-b border-[#E5E7EB] px-5 py-3.5">
        <Link
          to={`/education/${course.id}`}
          className="inline-flex min-w-0 items-center gap-1.5 text-sm font-semibold text-[#1C5DD4] transition-colors hover:underline"
        >
          <ChevronLeft className="size-4 shrink-0" aria-hidden />
          <span className="truncate">Back to course</span>
        </Link>
      </div>

      <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <Menu className="size-4.5 shrink-0 text-[#1A1A2E]" aria-hidden />
          <span className="truncate text-lg font-bold text-[#1A1A2E]">
            Content
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          title="Close content panel"
          aria-label="Close content panel"
          className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-gray-100"
        >
          <X className="size-4 text-[#9A9AB0]" aria-hidden />
        </button>
      </div>

      <div className="border-b border-[#E5E7EB] px-5 pt-5 pb-5.5">
        <div className="mb-2.5 flex items-baseline justify-between">
          <span className="text-sm font-bold text-[#1A1A2E]">
            Course completion
          </span>
          <span className="text-xs text-[#9A9AB0]">
            {isFullyDone
              ? `${totalLessons} lesson${totalLessons === 1 ? "" : "s"}`
              : `${completedCount}/${totalLessons} lessons`}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-sm bg-[#E8E8E8]">
          <div
            className="h-full rounded-sm bg-[#1C5DD4] transition-[width] duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-color:#BBBBBB_transparent] [scrollbar-width:thin]">
        {course.curriculum.map((section) => {
          /* A section opens once it holds something the learner may open: the
             lessons walk in order, so a section either sits behind the
             frontier, holds it, or is entirely past it. An empty section has
             nothing to gate. Derived from the lesson locks rather than being
             gated separately, so the two cannot disagree. */
          const isSectionLocked =
            section.lessons.length > 0 &&
            !section.lessons.some(isLessonUnlocked);

          const isOpen = openSectionIds.has(section.id) && !isSectionLocked;
          const doneInSection = section.lessons.filter((lesson) =>
            completedLessonIds.has(lesson.id),
          ).length;

          return (
            <div key={section.id}>
              <button
                type="button"
                disabled={isSectionLocked}
                onClick={() => onToggleSection(section.id)}
                aria-expanded={isSectionLocked ? undefined : isOpen}
                title={
                  isSectionLocked
                    ? "Finish the section before this one to open it"
                    : undefined
                }
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors",
                  isSectionLocked
                    ? "cursor-not-allowed"
                    : "cursor-pointer hover:bg-[#EFF4FE]",
                )}
              >
                <span
                  className={cn(
                    "text-sm font-bold",
                    isSectionLocked ? "text-[#9A9AB0]" : "text-[#1A1A2E]",
                  )}
                >
                  {section.title}
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className="text-sm text-[#9A9AB0]">
                    {isSectionLocked || doneInSection === 0
                      ? section.lessons.length
                      : `${doneInSection}/${section.lessons.length}`}
                  </span>
                  {isSectionLocked ? (
                    <Lock className="size-4 text-[#B4B4C2]" aria-hidden />
                  ) : (
                    <ChevronDown
                      className={cn(
                        "size-5 text-[#9A9AB0] transition-transform",
                        isOpen && "rotate-180",
                      )}
                      aria-hidden
                    />
                  )}
                </span>
              </button>

              {isOpen &&
                section.lessons.map((lesson) => {
                  const isActive = lesson.id === activeLessonId;
                  const isDone = completedLessonIds.has(lesson.id);
                  const isLocked = !isLessonUnlocked(lesson);

                  const marker = (
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center">
                      {isDone ? (
                        <span className="flex size-5 items-center justify-center rounded-full bg-[#1FC16B]">
                          <Check
                            className="size-3 text-white"
                            strokeWidth={3}
                            aria-hidden
                          />
                        </span>
                      ) : isLocked ? (
                        <Lock className="size-3.5 text-[#B4B4C2]" aria-hidden />
                      ) : (
                        <span
                          className={cn(
                            "size-4 rounded-full border-2",
                            isActive ? "border-[#1C5DD4]" : "border-[#D5D5DE]",
                          )}
                        />
                      )}
                    </span>
                  );

                  const body = (
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block text-sm leading-[1.4]",
                          isActive
                            ? "font-bold text-[#1C5DD4]"
                            : isLocked
                              ? "text-[#9A9AB0]"
                              : "text-[#333333]",
                        )}
                      >
                        {lessonIndex(lesson)}. {lesson.title}
                      </span>
                      <span className="mt-1 flex items-center gap-1.5 text-xs text-[#9A9AB0]">
                        <LessonTypeIcon
                          type={lesson.type}
                          className="size-3.25 shrink-0"
                        />
                        <span className="truncate">
                          {isLocked
                            ? "Finish the lesson before this one"
                            : lessonDetail(lesson)}
                        </span>
                      </span>
                    </span>
                  );

                  /* Rendered as plain text rather than a dimmed link: a locked
                     lesson has had its media withheld, so a link would lead to
                     a player with nothing in it. */
                  if (isLocked) {
                    return (
                      <div
                        key={lesson.id}
                        aria-disabled
                        title="Finish the lesson before this one to open it"
                        className="flex cursor-not-allowed items-start gap-3 px-5 py-3"
                      >
                        {marker}
                        {body}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={lesson.id}
                      to={`/education/${course.id}/learn?lesson=${lesson.id}`}
                      className={cn(
                        "flex items-start gap-3 px-5 py-3 transition-colors",
                        isActive ? "bg-[#EFF4FE]" : "hover:bg-[#F5F6F8]",
                      )}
                    >
                      {marker}
                      {body}
                    </Link>
                  );
                })}
            </div>
          );
        })}
      </div>

      {hasQuiz && (
        <Link
          to={quizUnlocked ? `/education/${course.id}/quiz` : "#"}
          aria-disabled={!quizUnlocked}
          onClick={(event) => {
            if (!quizUnlocked) event.preventDefault();
          }}
          title={
            quizUnlocked
              ? undefined
              : "Finish every chapter to unlock the final quiz"
          }
          className={cn(
            "flex shrink-0 items-start gap-3 border-t border-[#E5E7EB] px-5 py-3.5 transition-colors",
            quizUnlocked
              ? "hover:bg-[#EFF4FE]"
              : "cursor-not-allowed opacity-60",
          )}
        >
          <Award
            className="mt-0.5 size-5 shrink-0 text-[#9A9AB0]"
            aria-hidden
          />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-[#1A1A2E]">
              Final quiz
            </span>
            <span className="mt-0.75 block text-xs text-[#9A9AB0]">
              {quizUnlocked
                ? "Unlocked"
                : `${totalLessons - completedCount} chapter${
                    totalLessons - completedCount === 1 ? "" : "s"
                  } left`}
            </span>
          </span>
        </Link>
      )}

      {isFullyDone && (
        <div className="shrink-0 border-t border-[#E5E7EB] px-5 py-3.5">
          <Link
            to={`/education/${course.id}/certificate`}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1C5DD4] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#174FB4]"
          >
            <Award className="size-4" aria-hidden />
            View my certificate
          </Link>
        </div>
      )}
    </div>
  );
}
