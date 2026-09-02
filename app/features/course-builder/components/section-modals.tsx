import type { ReactNode } from "react";
import { X } from "lucide-react";

/**
 * The section dialogs from the design's curriculum step: naming a new section,
 * renaming or deleting an existing one, and confirming the delete.
 *
 * All three share the design's overlay — a 45%-black scrim over a 12px-radius
 * white panel with `28px 32px 32px` of padding.
 */
function Overlay({
  label,
  onClose,
  children,
  className = "max-w-105 px-8 pt-7 pb-8",
  zClass = "z-80",
}: {
  label: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  zClass?: string;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={onClose}
      className={`fixed inset-0 ${zClass} flex items-center justify-center bg-[rgba(26,26,46,0.45)] p-5`}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={`relative w-full rounded-xl bg-white shadow-[0_20px_60px_rgba(26,26,46,0.25)] ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

const LABEL = "mb-[7px] block text-sm font-bold text-[#1A1A2E]";
const FIELD =
  "w-full rounded-lg border border-[#E5E7EB] px-3.5 py-3 text-sm text-[#333333] outline-none focus:border-[#1C5DD4]";
const PRIMARY =
  "cursor-pointer rounded-lg bg-[#1C5DD4] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#174FB4]";

interface AddSectionModalProps {
  title: string;
  onTitleChange: (title: string) => void;
  onConfirm: () => void;
  /** Backdrop / X — the X asks before dropping a title in progress. */
  onClose: () => void;
  discarding: boolean;
  onRequestDiscard: () => void;
  onCancelDiscard: () => void;
}

export function AddSectionModal({
  title,
  onTitleChange,
  onConfirm,
  onClose,
  discarding,
  onRequestDiscard,
  onCancelDiscard,
}: AddSectionModalProps) {
  return (
    <Overlay label="Add section" onClose={onClose}>
      <button
        type="button"
        aria-label="Close"
        onClick={onRequestDiscard}
        className="absolute top-4 right-4 flex cursor-pointer p-1 text-[#9A9AB0]"
      >
        <X size={18} strokeWidth={2} aria-hidden />
      </button>

      <h3 className="mb-4.5 text-xl font-bold text-[#1A1A2E]">Add section</h3>

      <div className="mb-5.5">
        <label className={LABEL} htmlFor="new-section-title">
          Section title
        </label>
        <input
          id="new-section-title"
          autoFocus
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && title.trim()) onConfirm();
          }}
          placeholder="e.g. Section 4 · Marketing on a budget"
          className={FIELD}
        />
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onConfirm}
          disabled={!title.trim()}
          className={`${PRIMARY} disabled:cursor-not-allowed disabled:opacity-50`}
        >
          Add section
        </button>
      </div>

      {discarding && (
        <div
          onClick={(event) => event.stopPropagation()}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3.5 rounded-xl bg-white/96 p-6 text-center"
        >
          <div className="text-[15px] font-bold text-[#1A1A2E]">
            Discard this chapter?
          </div>
          <div className="text-[13px] text-[#9A9AB0]">
            Your entered title will be lost.
          </div>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={onCancelDiscard}
              className="cursor-pointer rounded-lg bg-[#F3F4F6] px-4.5 py-2.5 text-[13px] font-bold text-[#1A1A2E]"
            >
              Keep editing
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg bg-[#FB3748] px-4.5 py-2.5 text-[13px] font-bold text-white"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </Overlay>
  );
}

interface EditSectionModalProps {
  title: string;
  onTitleChange: (title: string) => void;
  onSave: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function EditSectionModal({
  title,
  onTitleChange,
  onSave,
  onDelete,
  onClose,
}: EditSectionModalProps) {
  return (
    <Overlay label="Edit section" onClose={onClose}>
      <h3 className="mb-4.5 text-xl font-bold text-[#1A1A2E]">Edit section</h3>

      <div className="mb-5.5">
        <label className={LABEL} htmlFor="edit-section-title">
          Section title
        </label>
        <input
          id="edit-section-title"
          autoFocus
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && title.trim()) onSave();
          }}
          className={FIELD}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onDelete}
          className="cursor-pointer px-1 py-3 text-[13px] font-bold text-[#DC2626]"
        >
          Delete section
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!title.trim()}
          className={`${PRIMARY} disabled:cursor-not-allowed disabled:opacity-50`}
        >
          Save
        </button>
      </div>
    </Overlay>
  );
}

interface ConfirmRemoveSectionModalProps {
  lessonCount: number;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmRemoveSectionModal({
  lessonCount,
  onConfirm,
  onClose,
}: ConfirmRemoveSectionModalProps) {
  return (
    <Overlay
      label="Remove this section?"
      onClose={onClose}
      className="max-w-95 px-7.5 py-7 text-center"
      zClass="z-90"
    >
      <h3 className="mb-2.5 text-lg font-bold text-[#1A1A2E]">
        Remove this section?
      </h3>
      <p className="mb-5.5 text-sm leading-[1.5] text-[#9A9AB0]">
        This will remove the section and{" "}
        {lessonCount > 0 ? (
          <>
            its{" "}
            <strong className="text-[#1A1A2E]">
              {lessonCount} lesson{lessonCount === 1 ? "" : "s"}
            </strong>
          </>
        ) : (
          "its lessons"
        )}
        . This can&apos;t be undone.
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 cursor-pointer rounded-lg border border-[#E5E7EB] px-6 py-3 text-sm font-bold text-[#333333]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 cursor-pointer rounded-lg bg-[#DC2626] px-6 py-3 text-sm font-bold text-white"
        >
          Remove
        </button>
      </div>
    </Overlay>
  );
}
