import { useRef } from "react";
import { Upload } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  LESSON_UPLOAD_HINTS,
  type LessonSource,
} from "~/features/course-builder/types";

const ACCEPT: Record<Exclude<LessonSource, "youtube">, string> = {
  pdf: "application/pdf",
  audio: "audio/*",
};

interface LessonSourceFieldProps {
  source: LessonSource;
  url: string;
  fileName: string | null;
  urlPlaceholder: string;
  onUrlChange: (url: string) => void;
  onFileChange: (fileName: string | null) => void;
  /** Labels the file input for screen readers. */
  label: string;
}

/**
 * The source half of a lesson: a URL box for a YouTube link, or a drop zone for
 * a PDF or audio file.
 *
 * Files are recorded by name only. There is no lesson-upload endpoint on the
 * API — `presignCourseCover` covers images and nothing else — so the chosen
 * file is not sent anywhere yet.
 */
export function LessonSourceField({
  source,
  url,
  fileName,
  urlPlaceholder,
  onUrlChange,
  onFileChange,
  label,
}: LessonSourceFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  if (source === "youtube") {
    return (
      <input
        value={url}
        onChange={(event) => onUrlChange(event.target.value)}
        placeholder={urlPlaceholder}
        aria-label={label}
        className="w-full rounded-lg border border-[#E5E7EB] px-3.5 py-3 text-sm text-[#333333] outline-none focus:border-[#1C5DD4]"
      />
    );
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT[source]}
        aria-label={label}
        className="sr-only"
        onChange={(event) =>
          onFileChange(event.target.files?.[0]?.name ?? null)
        }
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          onFileChange(event.dataTransfer.files?.[0]?.name ?? null);
        }}
        className={cn(
          "w-full cursor-pointer rounded-lg border-[1.5px] border-dashed p-7 text-center text-sm transition-colors",
          fileName
            ? "border-[#1C5DD4] bg-[#EFF4FE] text-[#1C5DD4]"
            : "border-[#E5E7EB] text-[#9A9AB0] hover:border-[#C9D6F2]",
        )}
      >
        <Upload
          size={28}
          strokeWidth={1.8}
          aria-hidden
          className={cn(
            "mx-auto mb-2.5 block",
            fileName ? "text-[#1C5DD4]" : "text-[#9CA3AF]",
          )}
        />
        {fileName ?? LESSON_UPLOAD_HINTS[source]}
      </button>

      {fileName && (
        <button
          type="button"
          onClick={() => onFileChange(null)}
          className="mt-2 cursor-pointer text-[13px] font-semibold text-[#9A9AB0] hover:text-[#DC2626]"
        >
          Remove file
        </button>
      )}
    </div>
  );
}
