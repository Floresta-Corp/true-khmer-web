import { useRef, useState } from "react";
import { ChevronDown, GripVertical } from "lucide-react";
import { cn } from "~/lib/utils";
import { Required } from "../required-mark";
import type { CourseSection, LessonType } from "~/features/education/types";
import { lessonDetail } from "~/features/education/lib/lesson-media";

const TYPE_LABELS: Record<LessonType, string> = {
  video: "Video",
  pdf: "PDF",
  audio: "Audio",
};

function lessonMeta(lesson: CourseSection["lessons"][number]): string {
  const detail = lessonDetail(lesson);
  return detail
    ? `${TYPE_LABELS[lesson.type]} · ${detail}`
    : TYPE_LABELS[lesson.type];
}

interface CurriculumStepProps {
  error?: string;
  emptySectionIds?: Set<string>;
  sections: CourseSection[];
  openSections: Set<string>;
  onToggleSection: (id: string) => void;
  onAddSection: () => void;
  onEditSection: (sectionId: string) => void;
  onMoveSection: (draggedId: string, targetId: string) => void;
  onMoveLesson: (
    fromSectionId: string,
    lessonId: string,
    toSectionId: string,
    targetLessonId: string | null,
  ) => void;
  onAddLesson: (sectionId: string) => void;
  onEditLesson?: (sectionId: string, lessonId: string) => void;
}

function LessonBody({
  title,
  meta,
  onEdit,
}: {
  title: string;
  meta: string;
  onEdit?: () => void;
}) {
  const content = (
    <>
      <span className="min-w-0 flex-1 truncate text-sm text-[#333333]">
        {title}
      </span>
      <span className="shrink-0 text-[13px] text-[#9A9AB0]">{meta}</span>
    </>
  );

  const shared = "flex min-w-0 flex-1 items-center gap-3 py-3.5 pr-4 pl-3";

  return onEdit ? (
    <button
      type="button"
      onClick={onEdit}
      title="Edit this lesson"
      className={cn(shared, "cursor-pointer text-left")}
    >
      {content}
    </button>
  ) : (
    <span className={shared}>{content}</span>
  );
}

export function CurriculumStep({
  error,
  emptySectionIds,
  sections,
  openSections,
  onToggleSection,
  onAddSection,
  onEditSection,
  onMoveSection,
  onMoveLesson,
  onAddLesson,
  onEditLesson,
}: CurriculumStepProps) {
  type Drag =
    | { kind: "section"; sectionId: string }
    | { kind: "lesson"; sectionId: string; lessonId: string };

  const dragRef = useRef<Drag | null>(null);
  const [dragging, setDragging] = useState<Drag | null>(null);
  const [over, setOver] = useState<string | null>(null);

  const startDrag = (drag: Drag) => {
    dragRef.current = drag;
    setDragging(drag);
  };

  const endDrag = () => {
    dragRef.current = null;
    setDragging(null);
    setOver(null);
  };

  const allowDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
  };

  const beginDrag = (event: React.DragEvent, id: string) => {
    event.stopPropagation();
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", id);
  };

  return (
    <div>
      <div className="mb-4.5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="mb-1 text-[18px] font-bold whitespace-nowrap text-[#1A1A2E]">
            Build your curriculum
            <Required />
          </h3>
          <p className="text-sm text-[#9A9AB0]">
            Organize your course into sections and lessons.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddSection}
          className="shrink-0 cursor-pointer rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-[13px] font-bold whitespace-nowrap text-[#1C5DD4]"
        >
          + Add section
        </button>
      </div>

      {error && <p className="mb-3.5 text-[13px] text-[#FB3748]">{error}</p>}

      <div className="flex flex-col gap-3.5">
        {sections.map((section) => {
          const isOpen = openSections.has(section.id);
          const count = section.lessons.length;
          const isEmpty = emptySectionIds?.has(section.id) ?? false;

          return (
            <div
              key={section.id}
              draggable
              onDragStart={(event) => {
                beginDrag(event, section.id);
                startDrag({ kind: "section", sectionId: section.id });
              }}
              onDragOver={allowDrop}
              onDrop={(event) => {
                event.preventDefault();
                event.stopPropagation();
                const drag = dragRef.current;
                if (!drag) return;
                if (drag.kind === "section") {
                  onMoveSection(drag.sectionId, section.id);
                } else if (drag.sectionId !== section.id) {
                  onMoveLesson(drag.sectionId, drag.lessonId, section.id, null);
                }
                endDrag();
              }}
              onDragEnd={endDrag}
              className={cn(
                "overflow-hidden rounded-lg border",
                isEmpty ? "border-[#FB3748]" : "border-[#E5E7EB]",
                dragging?.kind === "section" &&
                  dragging.sectionId === section.id &&
                  "opacity-40",
              )}
            >
              <div className="flex flex-wrap items-center gap-3 bg-[#F3F6FD] px-4 py-3.5">
                <GripVertical
                  size={15}
                  aria-hidden
                  className="shrink-0 cursor-grab text-[#9A9AB0]"
                />
                <button
                  type="button"
                  onClick={() => onEditSection(section.id)}
                  title="Rename or delete this section"
                  className="min-w-0 flex-1 cursor-pointer truncate text-left text-[15px] font-bold text-[#1A1A2E]"
                >
                  {section.title}
                </button>
                <span
                  className={cn(
                    "shrink-0 text-[13px]",
                    isEmpty ? "font-semibold text-[#FB3748]" : "text-[#9A9AB0]",
                  )}
                >
                  {isEmpty
                    ? "Add at least one lesson"
                    : `${count} ${count === 1 ? "lesson" : "lessons"}`}
                </span>
                <button
                  type="button"
                  title="Expand or collapse"
                  aria-expanded={isOpen}
                  aria-label={`${isOpen ? "Collapse" : "Expand"} ${section.title}`}
                  onClick={() => onToggleSection(section.id)}
                  className="flex shrink-0 cursor-pointer text-[#9A9AB0]"
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

              {isOpen && (
                <>
                  {section.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      draggable
                      onDragStart={(event) => {
                        beginDrag(event, lesson.id);
                        startDrag({
                          kind: "lesson",
                          sectionId: section.id,
                          lessonId: lesson.id,
                        });
                      }}
                      onDragOver={(event) => {
                        allowDrop(event);
                        const drag = dragRef.current;
                        if (drag?.kind !== "lesson") return;
                        if (drag.lessonId !== lesson.id) setOver(lesson.id);
                      }}
                      onDragLeave={() =>
                        setOver((current) =>
                          current === lesson.id ? null : current,
                        )
                      }
                      onDrop={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        const drag = dragRef.current;
                        if (drag?.kind !== "lesson") return;
                        onMoveLesson(
                          drag.sectionId,
                          drag.lessonId,
                          section.id,
                          lesson.id,
                        );
                        endDrag();
                      }}
                      onDragEnd={endDrag}
                      className={cn(
                        "flex cursor-grab items-center border-t border-[#E5E7EB] transition-colors hover:bg-[#F5F5F5] active:cursor-grabbing",
                        dragging?.kind === "lesson" &&
                          dragging.lessonId === lesson.id &&
                          "opacity-40",
                        over === lesson.id &&
                          "bg-[#F3F6FD] shadow-[inset_0_2px_0_0_#1C5DD4]",
                      )}
                    >
                      <span
                        aria-hidden
                        className="flex shrink-0 items-center py-3.5 pl-4 text-[#9A9AB0]"
                      >
                        <GripVertical size={15} />
                      </span>

                      <LessonBody
                        title={lesson.title}
                        meta={lessonMeta(lesson)}
                        onEdit={
                          onEditLesson &&
                          (() => onEditLesson(section.id, lesson.id))
                        }
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => onAddLesson(section.id)}
                    className="w-full cursor-pointer border-t border-[#E5E7EB] py-3 pl-4 text-left text-[13px] font-bold text-[#1C5DD4]"
                  >
                    + Add lesson
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onAddSection}
        className="mt-3.5 w-full cursor-pointer rounded-lg border-[1.5px] border-dashed border-[#E5E7EB] bg-white py-3.5 text-[13px] font-bold text-[#1C5DD4]"
      >
        + Add section
      </button>
    </div>
  );
}
