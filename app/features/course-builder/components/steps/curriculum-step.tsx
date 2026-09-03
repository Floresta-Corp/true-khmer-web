import { useRef, useState } from "react";
import {
  ChevronDown,
  FileText,
  GripVertical,
  Info,
  Layers,
  Music,
  Play,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { LessonSourceField } from "../lesson-source-field";
import type { CourseSection, LessonType } from "~/features/education/types";
import {
  LESSON_SOURCES,
  LESSON_SOURCE_CARDS,
  LESSON_SOURCE_SUBTITLES,
  lessonSourceChange,
  type CourseFormat,
  type CourseFormatOption,
  type LessonDraft,
  type LessonSource,
} from "~/features/course-builder/types";

const SOURCE_ICONS: Record<LessonSource, typeof Play> = {
  youtube: Play,
  pdf: FileText,
  audio: Music,
};

/**
 * Copy inferred: the design computes these two cards in a script past the
 * 256 KiB fetch cap, so only their shape (radio, icon, label + badge, blurb) is
 * known for certain.
 */
const FORMAT_OPTIONS: CourseFormatOption[] = [
  {
    value: "multi",
    label: "Multiple sections",
    desc: "Organize your course into sections, each with its own lessons.",
    badge: "Recommended",
  },
  {
    value: "single",
    label: "Single lesson",
    desc: "One piece of content for the whole course.",
    badge: null,
  },
];

const FORMAT_ICONS: Record<CourseFormat, typeof Layers> = {
  multi: Layers,
  single: FileText,
};

const TYPE_LABELS: Record<LessonType, string> = {
  video: "Video",
  pdf: "PDF",
  audio: "Audio",
};

interface CurriculumStepProps {
  format: CourseFormat;
  /** The single-lesson course's own content, when the format is "single". */
  lesson: LessonDraft;
  onLessonChange: (changes: Partial<LessonDraft>) => void;
  sections: CourseSection[];
  openSections: Set<string>;
  onFormatChange: (format: CourseFormat) => void;
  onToggleSection: (id: string) => void;
  onAddSection: () => void;
  onEditSection: (sectionId: string) => void;
  /** Drag-reorder: move `draggedId` to where `targetId` currently sits. */
  onMoveSection: (draggedId: string, targetId: string) => void;
  /**
   * Drag-reorder a lesson. A `null` target drops it at the end of
   * `toSectionId` — what the design does when a lesson lands on a section
   * header rather than on another lesson.
   */
  onMoveLesson: (
    fromSectionId: string,
    lessonId: string,
    toSectionId: string,
    targetLessonId: string | null,
  ) => void;
  onAddLesson: (sectionId: string) => void;
}

export function CurriculumStep({
  format,
  lesson,
  onLessonChange,
  sections,
  openSections,
  onFormatChange,
  onToggleSection,
  onAddSection,
  onEditSection,
  onMoveSection,
  onMoveLesson,
  onAddLesson,
}: CurriculumStepProps) {
  type Drag =
    | { kind: "section"; sectionId: string }
    | { kind: "lesson"; sectionId: string; lessonId: string };

  /**
   * What is being dragged. The payload lives in a ref because `drop` must read
   * it in the same handler pass — reading it from state would depend on a
   * re-render having landed between `dragstart` and `drop`. The state copy
   * exists only to dim the dragged row.
   */
  const dragRef = useRef<Drag | null>(null);
  const [dragging, setDragging] = useState<Drag | null>(null);

  const startDrag = (drag: Drag) => {
    dragRef.current = drag;
    setDragging(drag);
  };

  const endDrag = () => {
    dragRef.current = null;
    setDragging(null);
  };

  /** Every drop target has to claim the drag or the browser rejects it. */
  const allowDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
  };

  /**
   * Firefox refuses to start a drag unless `dataTransfer` carries something,
   * so every `dragstart` seeds it even though the reorder reads local state.
   */
  const beginDrag = (event: React.DragEvent, id: string) => {
    event.stopPropagation();
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", id);
  };

  return (
    <div>
      <div className="mb-7">
        <h3 className="mb-1 text-[18px] font-bold text-[#1A1A2E]">
          Course structure
        </h3>
        <p className="mb-4 text-sm text-[#9A9AB0]">
          Choose how your course content is organized.
        </p>

        <div className="flex flex-wrap gap-4">
          {FORMAT_OPTIONS.map((option) => {
            const active = option.value === format;
            const Icon = FORMAT_ICONS[option.value];

            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => onFormatChange(option.value)}
                className={cn(
                  "flex min-w-[260px] flex-1 cursor-pointer items-center gap-3.5 rounded-lg border bg-white p-4 text-left transition-colors",
                  active
                    ? "border-[#1C5DD4] bg-[#EFF4FE]"
                    : "border-[#E5E7EB] hover:border-[#C9D6F2]",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                    active ? "border-[#1C5DD4]" : "border-[#C9CBD4]",
                  )}
                >
                  {active && (
                    <span className="size-2.5 rounded-full bg-[#1C5DD4]" />
                  )}
                </span>

                <span
                  aria-hidden
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#EFF4FE] text-[#1C5DD4]"
                >
                  <Icon size={18} />
                </span>

                <span className="min-w-0">
                  <span className="mb-[3px] flex items-center gap-2">
                    <span className="text-[15px] font-bold text-[#1A1A2E]">
                      {option.label}
                    </span>
                    {option.badge && (
                      <span className="rounded-full bg-[#D5E2FA] px-2.5 py-1 text-[11px] font-bold text-[#1C5DD4]">
                        {option.badge}
                      </span>
                    )}
                  </span>
                  <span className="block text-[13px] leading-[1.4] text-[#9A9AB0]">
                    {option.desc}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-6 border-t border-[#E5E7EB]" />

      {format === "single" ? (
        <div>
          <h3 className="mb-1 text-[18px] font-bold text-[#1A1A2E]">
            Add lesson content
          </h3>
          <p className="mb-5 text-sm text-[#9A9AB0]">
            Add the main learning material for this course.
          </p>

          <div className="flex flex-col gap-5">
            <div>
              <span className="mb-2.25 block text-sm font-bold text-[#1A1A2E]">
                Content format
              </span>
              <div className="flex flex-wrap gap-3">
                {LESSON_SOURCES.map((source) => {
                  const active = source === lesson.source;
                  const Icon = SOURCE_ICONS[source];

                  return (
                    <button
                      key={source}
                      type="button"
                      aria-pressed={active}
                      onClick={() => onLessonChange(lessonSourceChange(source))}
                      className={cn(
                        "flex flex-1 cursor-pointer items-center gap-3 rounded-lg border p-3.5 text-left transition-colors sm:min-w-[210px] sm:flex-none",
                        active
                          ? "border-[#1C5DD4] bg-[#EFF4FE]"
                          : "border-[#E5E7EB] hover:border-[#C9D6F2]",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "flex size-[18px] shrink-0 items-center justify-center rounded-full border-2",
                          active ? "border-[#1C5DD4]" : "border-[#C9CBD4]",
                        )}
                      >
                        {active && (
                          <span className="size-2.25 rounded-full bg-[#1C5DD4]" />
                        )}
                      </span>

                      <span
                        aria-hidden
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#EFF4FE] text-[#1C5DD4]"
                      >
                        <Icon size={16} />
                      </span>

                      <span className="min-w-0">
                        <span className="mb-0.5 block text-sm font-bold text-[#1A1A2E]">
                          {LESSON_SOURCE_CARDS[source].label}
                        </span>
                        <span className="block text-xs text-[#9A9AB0]">
                          {LESSON_SOURCE_CARDS[source].desc}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2.5 text-[13px] text-[#9A9AB0]">
                {LESSON_SOURCE_SUBTITLES[lesson.source]}
              </p>

              <LessonSourceField
                source={lesson.source}
                url={lesson.url}
                fileName={lesson.fileName}
                urlPlaceholder="Paste YouTube URL here"
                label={LESSON_SOURCE_CARDS[lesson.source].label}
                onUrlChange={(url) => onLessonChange({ url })}
                onUploaded={(assetKey, fileName) =>
                  onLessonChange({ assetKey, fileName })
                }
                onClearFile={() =>
                  onLessonChange({ assetKey: null, fileName: null })
                }
              />

              {lesson.source === "youtube" && (
                <div className="mt-3 flex items-start gap-2.5 rounded-lg bg-[#EFF4FE] px-3.5 py-3">
                  <Info
                    size={17}
                    aria-hidden
                    className="mt-px shrink-0 text-[#1C5DD4]"
                  />
                  <span className="text-[13px] leading-[1.5] text-[#1C5DD4]">
                    Make sure the video is public so your learners can access
                    it.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-[18px] flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="mb-1 text-[18px] font-bold whitespace-nowrap text-[#1A1A2E]">
                Build your curriculum
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

          <div className="flex flex-col gap-3.5">
            {sections.map((section) => {
              const isOpen = openSections.has(section.id);
              const count = section.lessons.length;

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
                      // A lesson dropped on a section header joins the end.
                      onMoveLesson(
                        drag.sectionId,
                        drag.lessonId,
                        section.id,
                        null,
                      );
                    }
                    endDrag();
                  }}
                  onDragEnd={endDrag}
                  className={cn(
                    "overflow-hidden rounded-lg border border-[#E5E7EB]",
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
                    {/* The design renames a section by clicking its title. */}
                    <button
                      type="button"
                      onClick={() => onEditSection(section.id)}
                      title="Rename or delete this section"
                      className="min-w-0 flex-1 cursor-pointer truncate text-left text-[15px] font-bold text-[#1A1A2E]"
                    >
                      {section.title}
                    </button>
                    <span className="shrink-0 text-[13px] text-[#9A9AB0]">
                      {count} {count === 1 ? "lesson" : "lessons"}
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
                          onDragOver={allowDrop}
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
                            "flex cursor-pointer items-center gap-3 border-t border-[#E5E7EB] px-4 py-3.5 transition-colors hover:bg-[#F5F5F5]",
                            dragging?.kind === "lesson" &&
                              dragging.lessonId === lesson.id &&
                              "opacity-40",
                          )}
                        >
                          <GripVertical
                            size={15}
                            aria-hidden
                            className="shrink-0 cursor-grab text-[#9A9AB0]"
                          />
                          <span className="min-w-0 flex-1 truncate text-sm text-[#333333]">
                            {lesson.title}
                          </span>
                          <span className="shrink-0 text-[13px] text-[#9A9AB0]">
                            {TYPE_LABELS[lesson.type]}
                            {lesson.duration ? ` · ${lesson.duration}` : ""}
                          </span>
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
      )}
    </div>
  );
}
