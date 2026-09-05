import { Trash2, X } from "lucide-react";
import { cn } from "~/lib/utils";
import { LessonSourceField } from "./lesson-source-field";
import { isYoutubeUrl } from "../lib/youtube-url";
import {
  LESSON_FIELD_LABELS,
  LESSON_SOURCES,
  LESSON_SOURCE_LABELS,
  lessonSourceChange,
  type LessonDraft,
  type LessonSource,
} from "~/features/course-builder/types";

interface AddLessonModalProps {
  draft: LessonDraft;
  /** "edit" reopens a saved lesson; the form is otherwise identical. */
  mode?: "add" | "edit";
  onChange: (changes: Partial<LessonDraft>) => void;
  onConfirm: () => void;
  onClose: () => void;
  /** Offered while editing, so a lesson can be taken out of its section. */
  onDelete?: () => void;
  uploading?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
}

export function AddLessonModal({
  draft,
  mode = "add",
  onChange,
  onConfirm,
  onClose,
  onDelete,
  uploading = false,
  onUploadingChange,
}: AddLessonModalProps) {
  const editing = mode === "edit";
  const ready =
    !uploading &&
    draft.title.trim().length > 0 &&
    (draft.source === "youtube" ? isYoutubeUrl(draft.url) : !!draft.assetKey);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={editing ? "Edit lesson" : "Add lesson"}
      onClick={onClose}
      className="fixed inset-0 z-80 flex items-center justify-center bg-[rgba(26,26,46,0.45)] p-5"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-120 flex-col rounded-xl bg-white shadow-[0_20px_60px_rgba(26,26,46,0.25)]"
      >
        <div className="relative shrink-0 px-8 pt-7 pb-5">
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute top-5 right-5 flex cursor-pointer p-1 text-[#9A9AB0]"
          >
            <X size={18} strokeWidth={2} aria-hidden />
          </button>
          <h3 className="text-xl font-bold text-[#1A1A2E]">
            {editing ? "Edit lesson" : "Add lesson"}
          </h3>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-8">
          <div className="flex flex-col gap-6 pb-1">
            <div>
              <label
                htmlFor="lesson-title"
                className="mb-2 block text-sm font-bold text-[#1A1A2E]"
              >
                Lesson title
              </label>
              <input
                id="lesson-title"
                value={draft.title}
                onChange={(event) => onChange({ title: event.target.value })}
                className="w-full rounded-lg border border-[#E5E7EB] px-3.5 py-3 text-sm text-[#333333] outline-none focus:border-[#1C5DD4]"
              />
            </div>

            <div>
              <span className="mb-2.5 block text-sm font-bold text-[#1A1A2E]">
                Content type
              </span>
              <div className="flex flex-wrap gap-2.5">
                {LESSON_SOURCES.map((source) => {
                  const active = source === draft.source;

                  return (
                    <button
                      key={source}
                      type="button"
                      aria-pressed={active}
                      onClick={() => onChange(lessonSourceChange(source))}
                      className={cn(
                        "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm font-semibold transition-colors",
                        active
                          ? "border-[#1C5DD4] bg-[#EFF4FE] text-[#1C5DD4]"
                          : "border-[#E5E7EB] text-[#333333] hover:border-[#C9D6F2]",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "flex size-4.5 shrink-0 items-center justify-center rounded-full border-2",
                          active ? "border-[#1C5DD4]" : "border-[#C9CBD4]",
                        )}
                      >
                        {active && (
                          <span className="size-2 rounded-full bg-[#1C5DD4]" />
                        )}
                      </span>
                      {LESSON_SOURCE_LABELS[source]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="mb-2 block text-sm font-bold text-[#1A1A2E]">
                {LESSON_FIELD_LABELS[draft.source]}
              </span>
              <LessonSourceField
                source={draft.source}
                url={draft.url}
                fileName={draft.fileName}
                urlPlaceholder="https://youtube.com/watch?v=..."
                label={LESSON_FIELD_LABELS[draft.source]}
                onUrlChange={(url) => onChange({ url })}
                onUploaded={(assetKey, fileName) =>
                  onChange({ assetKey, fileName })
                }
                onClearFile={() => onChange({ assetKey: null, fileName: null })}
                onUploadingChange={onUploadingChange}
              />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 px-8 pt-5 pb-7">
          <button
            type="button"
            disabled={!ready}
            onClick={onConfirm}
            className="flex-1 cursor-pointer rounded-lg bg-[#1C5DD4] px-6 py-3 text-sm font-bold text-white disabled:cursor-default disabled:opacity-50"
          >
            {editing ? "Save lesson" : "Add lesson"}
          </button>
          {editing && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 py-3 text-[13px] font-semibold text-[#9A9AB0] hover:text-[#FB3748]"
            >
              <Trash2 size={14} aria-hidden />
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 cursor-pointer px-2 py-3 text-[13px] font-medium text-[#9A9AB0]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export type { LessonSource };
