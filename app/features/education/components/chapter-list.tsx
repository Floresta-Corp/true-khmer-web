import { Link } from "react-router";
import { CheckCircle2, ChevronDown, Circle, GraduationCap } from "lucide-react";
import { cn } from "~/lib/utils";
import { CARD } from "~/features/education/lib/education-styles";
import type { CourseDetail, CourseLesson } from "~/features/education/types";
import { LessonTypeIcon } from "./lesson-type-icon";

interface ChapterListProps {
  course: CourseDetail;
  activeLessonId: string;
  completedLessonIds: Set<string>;
  openSectionIds: Set<string>;
  onToggleSection: (sectionId: string) => void;
  /** Position of a lesson across the whole course, 1-based. */
  lessonIndex: (lesson: CourseLesson) => number;
  quizUnlocked: boolean;
}

export function ChapterList({
  course,
  activeLessonId,
  completedLessonIds,
  openSectionIds,
  onToggleSection,
  lessonIndex,
  quizUnlocked,
}: ChapterListProps) {
  const totalLessons = course.curriculum.reduce(
    (sum, section) => sum + section.lessons.length,
    0,
  );

  return (
    <div className={`${CARD} overflow-hidden`}>
      <div className="flex items-baseline justify-between border-b border-gray-200 px-5 py-4.5">
        <span className="text-lg font-bold text-[#1A1A2E]">Chapters</span>
        <span className="text-xs text-[#9A9AB0]">
          {completedLessonIds.size}/{totalLessons} complete
        </span>
      </div>

      <div className="max-h-105 overflow-y-auto [scrollbar-color:#BBBBBB_transparent] [scrollbar-width:thin]">
        {course.curriculum.map((section) => {
          const isOpen = openSectionIds.has(section.id);
          return (
            <div key={section.id}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => onToggleSection(section.id)}
                className="flex w-full cursor-pointer items-center justify-between gap-3 border-b border-gray-200 bg-white px-5 py-3.5 text-left"
              >
                <span className="text-sm font-bold text-[#1A1A2E]">
                  {section.title}
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className="text-sm text-[#9A9AB0]">
                    {section.lessons.length}
                  </span>
                  <ChevronDown
                    aria-hidden
                    className={cn(
                      "size-5 text-[#9A9AB0] transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </span>
              </button>

              {isOpen &&
                section.lessons.map((lesson) => {
                  const isActive = lesson.id === activeLessonId;
                  const isComplete = completedLessonIds.has(lesson.id);
                  return (
                    <Link
                      key={lesson.id}
                      to={`/education/${course.id}/learn?lesson=${lesson.id}`}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "flex items-center gap-3 border-b border-gray-200 px-5 py-3.5 transition-colors",
                        isActive ? "bg-[#D5E2FA]/50" : "hover:bg-gray-50",
                      )}
                    >
                      <span className="flex size-5 shrink-0 items-center justify-center">
                        {isComplete ? (
                          <CheckCircle2
                            className="size-5 fill-[#1FC16B] text-white"
                            aria-hidden
                          />
                        ) : (
                          <Circle
                            className="size-4.5 text-[#9A9AB0]"
                            aria-hidden
                          />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block truncate text-sm",
                            isActive
                              ? "font-bold text-[#1C5DD4]"
                              : "text-[#333333]",
                          )}
                        >
                          {lessonIndex(lesson)}. {lesson.title}
                        </span>
                        <span className="mt-0.75 flex items-center gap-1.25 text-xs text-[#9A9AB0]">
                          <LessonTypeIcon
                            type={lesson.type}
                            className="size-3.25"
                          />
                          {lesson.duration}
                        </span>
                      </span>
                    </Link>
                  );
                })}
            </div>
          );
        })}
      </div>

      <Link
        to={quizUnlocked ? `/education/${course.id}/quiz` : "#"}
        aria-disabled={!quizUnlocked}
        onClick={(event) => {
          if (!quizUnlocked) event.preventDefault();
        }}
        className={cn(
          "flex items-center gap-3 border-t border-gray-200 px-5 py-3.5 transition-colors",
          quizUnlocked ? "hover:bg-gray-50" : "cursor-not-allowed opacity-60",
        )}
      >
        <span className="flex size-5 shrink-0 items-center justify-center">
          <GraduationCap className="size-5 text-[#1C5DD4]" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-[#1A1A2E]">
            Final quiz
          </span>
          <span className="mt-0.75 block text-xs text-[#9A9AB0]">
            {quizUnlocked
              ? "Ready — pass to earn your certificate"
              : "Complete every chapter to unlock"}
          </span>
        </span>
      </Link>
    </div>
  );
}
