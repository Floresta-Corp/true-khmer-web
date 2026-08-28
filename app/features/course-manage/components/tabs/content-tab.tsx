import { useState } from "react";
import { Link } from "react-router";
import { ChevronDown, Pencil } from "lucide-react";
import { cn } from "~/lib/utils";
import { LessonTypeIcon } from "~/features/education/components/lesson-type-icon";
import type { CourseSection } from "~/features/education/types";
import { MANAGE_CARD } from "../overview/course-kpi-cards";

/**
 * The teacher's curriculum. One container with divided sections — not a card
 * per section — with `Chapter N: Title` headers and edit affordances that
 * appear on hover, matching `isTeachContentTab` in the design.
 */
export function ContentTab({
  courseId,
  curriculum,
}: {
  courseId: string;
  curriculum: CourseSection[];
}) {
  /** Editing content happens in the builder, on its curriculum step. */
  const editTo = `/education/${courseId}/edit?step=curriculum`;

  // Every chapter starts expanded, as the design's `s.open` placeholder does.
  const [open, setOpen] = useState<Set<string>>(
    () => new Set(curriculum.map((section) => section.id)),
  );

  const toggle = (id: string) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  if (curriculum.length === 0) {
    return (
      <div className={`${MANAGE_CARD} px-6 py-12 text-center`}>
        <p className="text-sm font-semibold text-[#1A1A2E]">No content yet</p>
        <p className="mt-1.5 text-xs text-[#9A9AB0]">
          Sections and lessons you add will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className={`${MANAGE_CARD} overflow-hidden rounded-lg`}>
      {curriculum.map((section, index) => {
        const isOpen = open.has(section.id);
        const lessons = section.lessons.length;

        return (
          <div
            key={section.id}
            className={cn(
              "group/section",
              index > 0 && "border-t border-[#E5E7EB]",
            )}
          >
            {/* The whole header toggles: the chevron button is stretched over the
                row with `after:inset-0`, so there is one tab stop and a real
                focus ring, and the pencil stays clickable above it. */}
            <div className="relative flex cursor-pointer items-center justify-between gap-3 p-5 transition-colors hover:bg-[#F9FAFC]">
              <div className="flex min-w-0 items-center gap-2">
                <span className="truncate text-[18px] font-bold text-[#1A1A2E]">
                  Chapter {index + 1}: {section.title}
                </span>
                <Link
                  to={editTo}
                  title="Edit chapter"
                  aria-label={`Edit chapter ${index + 1}`}
                  className="relative z-10 cursor-pointer text-[#9A9AB0] opacity-0 transition-opacity group-hover/section:opacity-100 hover:text-[#1C5DD4] focus-visible:opacity-100"
                >
                  <Pencil size={15} aria-hidden />
                </Link>
              </div>

              <div className="flex shrink-0 items-center gap-3.5">
                <span className="text-[13px] text-[#9A9AB0]">
                  {lessons} {lessons === 1 ? "lesson" : "lessons"}
                </span>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-label={`${isOpen ? "Collapse" : "Expand"} chapter ${index + 1}`}
                  onClick={() => toggle(section.id)}
                  className="flex cursor-pointer text-[#9A9AB0] after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C5DD4]"
                >
                  <ChevronDown
                    size={16}
                    aria-hidden
                    className={cn(
                      "transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
              </div>
            </div>

            {isOpen && (
              <div className="flex flex-col">
                {section.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="group/lesson relative flex cursor-pointer items-center gap-3 py-3.5 pr-5 pl-11 transition-colors hover:bg-[#F9FAFC]"
                  >
                    <LessonTypeIcon
                      type={lesson.type}
                      className="size-4 shrink-0 text-[#777777]"
                    />
                    <span className="flex min-w-0 flex-1 items-center gap-2">
                      <span className="truncate text-sm text-[#333333]">
                        {lesson.title}
                      </span>
                      {/* Stretched over the row, so clicking anywhere on the
                          lesson opens the builder — one tab stop, and the
                          accessible name comes from the visible title. */}
                      <Link
                        to={editTo}
                        title="Edit lesson"
                        aria-label={`Edit ${lesson.title}`}
                        className="shrink-0 cursor-pointer text-[#9A9AB0] opacity-0 transition-opacity group-hover/lesson:opacity-100 after:absolute after:inset-0 hover:text-[#1C5DD4] focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C5DD4]"
                      >
                        <Pencil size={14} aria-hidden />
                      </Link>
                    </span>
                    <span className="shrink-0 text-[12.5px] text-[#9A9AB0]">
                      {lesson.duration}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
