import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronDown, Lock } from "lucide-react";
import { cn } from "~/lib/utils";
import { CARD } from "~/features/education/lib/education-styles";
import type { CourseDetail } from "~/features/education/types";
import { LessonTypeIcon } from "./lesson-type-icon";

interface CourseCurriculumTabProps {
  course: CourseDetail;
}

export function CourseCurriculumTab({ course }: CourseCurriculumTabProps) {
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(course.curriculum.slice(0, 1).map((section) => section.id)),
  );

  const toggleSection = (sectionId: string) => {
    setOpenSections((current) => {
      const next = new Set(current);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  if (course.curriculum.length === 0) {
    return (
      <p className={`${CARD} px-8 py-16 text-center text-base text-[#9A9AB0]`}>
        The curriculum for this course has not been published yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3.5">
      {course.curriculum.map((section) => {
        const isOpen = openSections.has(section.id);
        return (
          <div key={section.id} className={`${CARD} overflow-hidden`}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => toggleSection(section.id)}
              className="flex w-full cursor-pointer items-center justify-between gap-3 bg-white px-5 py-4 text-left"
            >
              <span className="text-lg font-bold text-[#1A1A2E]">
                {section.title}
              </span>
              <span className="flex shrink-0 items-center gap-2 text-xs text-[#9A9AB0]">
                {section.lessons.length} lessons
                <ChevronDown
                  aria-hidden
                  className={cn(
                    "size-4.5 transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              </span>
            </button>

            {isOpen && (
              <ul>
                {section.lessons.map((lesson) => {
                  const canOpen = course.isEnrolled || lesson.isPreview;
                  return (
                    <li key={lesson.id}>
                      <button
                        type="button"
                        disabled={!canOpen}
                        onClick={() =>
                          navigate(
                            `/education/${course.id}/learn?lesson=${lesson.id}`,
                          )
                        }
                        className={cn(
                          "flex w-full items-center gap-3 border-b border-gray-200 px-5 py-3.5 text-left transition-colors",
                          canOpen
                            ? "cursor-pointer hover:bg-gray-50"
                            : "cursor-not-allowed",
                        )}
                      >
                        <LessonTypeIcon
                          type={lesson.type}
                          className="size-4.5 shrink-0 text-[#9A9AB0]"
                        />
                        <span
                          className={cn(
                            "min-w-0 flex-1 truncate text-sm",
                            canOpen ? "text-[#333333]" : "text-[#9A9AB0]",
                          )}
                        >
                          {lesson.title}
                        </span>
                        {!canOpen && (
                          <Lock
                            className="size-3.5 shrink-0 text-[#9A9AB0]"
                            aria-hidden
                          />
                        )}
                        <span className="shrink-0 text-xs text-[#9A9AB0]">
                          {lesson.duration}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
