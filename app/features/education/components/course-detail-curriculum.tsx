import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router";
import { cn } from "~/lib/utils";
import type { CourseDetail } from "~/features/education/types";
import { LessonTypeIcon } from "./lesson-type-icon";

/** The design opens the first three sections (`openSections: [0, 1, 2]`). */
const DEFAULT_OPEN_SECTIONS = 3;

/**
 * The detail screen's curriculum panel: a bordered, scrolling accordion that
 * sits beside the course content rather than behind a tab.
 *
 * Measurements are the design's own — 8px radius, a 520px scroll cap, and
 * 14px/20px rows for both the section header and its lessons.
 */
export function CourseDetailCurriculum({ course }: { course: CourseDetail }) {
  const navigate = useNavigate();
  const [openIds, setOpenIds] = useState<Set<string>>(
    () =>
      new Set(
        course.curriculum
          .slice(0, DEFAULT_OPEN_SECTIONS)
          .map((section) => section.id),
      ),
  );

  const toggle = (id: string) =>
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  if (course.curriculum.length === 0) {
    return (
      <div className="rounded-lg border border-[#E5E7EB] px-5 py-8 text-center text-sm text-[#9A9AB0]">
        The curriculum for this course has not been published yet.
      </div>
    );
  }

  return (
    <div className="max-h-130 overflow-y-auto rounded-lg border border-[#E5E7EB] [scrollbar-color:#BBBBBB_transparent] [scrollbar-width:thin]">
      {course.curriculum.map((section, index) => {
        const isOpen = openIds.has(section.id);

        return (
          <div
            key={section.id}
            className={cn(
              index < course.curriculum.length - 1 &&
                "border-b border-[#E5E7EB]",
            )}
          >
            <button
              type="button"
              onClick={() => toggle(section.id)}
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer items-center justify-between gap-6 px-5 py-3.5 text-left"
            >
              <span className="text-base leading-[1.4] font-bold text-[#1A1A2E] transition-colors hover:text-[#1C5DD4]">
                {section.title}
              </span>
              <span className="flex shrink-0 items-center gap-2 text-xs text-[#9A9AB0]">
                {section.lessons.length}{" "}
                {section.lessons.length === 1 ? "lesson" : "lessons"}
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform",
                    isOpen && "rotate-180",
                  )}
                  aria-hidden
                />
              </span>
            </button>

            {isOpen && (
              <div>
                {section.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() =>
                      navigate(
                        `/education/${course.id}/learn?lesson=${lesson.id}`,
                      )
                    }
                    className="flex w-full cursor-pointer items-center gap-6 bg-white px-5 py-3.5 text-left transition-colors hover:bg-[#EFF4FE]"
                  >
                    <LessonTypeIcon
                      type={lesson.type}
                      className="size-4 shrink-0 text-[#9A9AB0]"
                    />
                    <span className="line-clamp-2 min-w-0 flex-1 text-sm leading-[1.4] text-[#9A9AB0]">
                      {lesson.title}
                    </span>
                    {lesson.duration && (
                      <span className="shrink-0 text-xs text-[#9A9AB0]">
                        {lesson.duration}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
