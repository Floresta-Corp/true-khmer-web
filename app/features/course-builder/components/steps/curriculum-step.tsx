import { ChevronDown, FileText, GripVertical, Layers } from "lucide-react";
import { cn } from "~/lib/utils";
import type { CourseSection, LessonType } from "~/features/education/types";
import type {
  CourseFormat,
  CourseFormatOption,
} from "~/features/course-builder/types";

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
  sections: CourseSection[];
  openSections: Set<string>;
  onFormatChange: (format: CourseFormat) => void;
  onToggleSection: (id: string) => void;
  onAddSection: () => void;
  onAddLesson: (sectionId: string) => void;
}

export function CurriculumStep({
  format,
  sections,
  openSections,
  onFormatChange,
  onToggleSection,
  onAddSection,
  onAddLesson,
}: CurriculumStepProps) {
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
          <div className="rounded-lg border border-dashed border-[#E5E7EB] px-6 py-12 text-center">
            <p className="text-[13px] text-[#9A9AB0]">
              Uploading lesson content needs an API that does not exist yet.
            </p>
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
                  className="overflow-hidden rounded-lg border border-[#E5E7EB]"
                >
                  <div className="flex flex-wrap items-center gap-3 bg-[#F3F6FD] px-4 py-3.5">
                    <GripVertical
                      size={15}
                      aria-hidden
                      className="shrink-0 cursor-grab text-[#9A9AB0]"
                    />
                    <span className="min-w-0 flex-1 truncate text-[15px] font-bold text-[#1A1A2E]">
                      {section.title}
                    </span>
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
                          className="flex cursor-pointer items-center gap-3 border-t border-[#E5E7EB] px-4 py-3.5 transition-colors hover:bg-[#F5F5F5]"
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
