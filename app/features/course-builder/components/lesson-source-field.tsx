import { useEffect, useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { useFetcher } from "react-router";
import { cn } from "~/lib/utils";
import {
  LESSON_UPLOAD_HINTS,
  type LessonSource,
} from "~/features/course-builder/types";
import {
  putLessonAsset,
  validateLessonFile,
  type LessonAssetUpload,
} from "../lib/upload-lesson-asset";
import { validateYoutubeUrl } from "../lib/youtube-url";

const ACCEPT: Record<Exclude<LessonSource, "youtube">, string> = {
  pdf: "application/pdf",
  audio: "audio/*",
};

type PresignResult =
  | { ok: true; intent: "presign-lesson"; upload: LessonAssetUpload }
  | { ok: false; error?: string };

interface LessonSourceFieldProps {
  source: LessonSource;
  url: string;
  fileName: string | null;
  urlPlaceholder: string;
  onUrlChange: (url: string) => void;
  onUploaded: (assetKey: string, fileName: string) => void;
  onClearFile: () => void;
  onUploadingChange?: (uploading: boolean) => void;
  label: string;
}

export function LessonSourceField({
  source,
  url,
  fileName,
  urlPlaceholder,
  onUrlChange,
  onUploaded,
  onClearFile,
  onUploadingChange,
  label,
}: LessonSourceFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fetcher = useFetcher<PresignResult>();
  const pendingFile = useRef<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** A half-typed link is not wrong yet, so only complain once they leave. */
  const [urlTouched, setUrlTouched] = useState(false);

  const selection = useRef(0);

  const busy = uploading || fetcher.state !== "idle";

  useEffect(() => {
    onUploadingChange?.(busy);
  }, [busy, onUploadingChange]);

  useEffect(() => {
    selection.current += 1;
    pendingFile.current = null;
    setError(null);
  }, [source]);

  const accept = (file: File | undefined) => {
    if (!file || source === "youtube") return;

    const problem = validateLessonFile(file, source);
    if (problem) {
      setError(problem);
      return;
    }

    setError(null);
    pendingFile.current = file;
    fetcher.submit(
      {
        intent: "presign-lesson",
        contentType: file.type,
        fileSize: String(file.size),
      },
      { method: "post" },
    );
  };

  useEffect(() => {
    const file = pendingFile.current;
    if (fetcher.state !== "idle" || !fetcher.data || !file) return;

    if (!fetcher.data.ok) {
      pendingFile.current = null;
      setError(fetcher.data.error ?? "That file could not be uploaded.");
      return;
    }

    pendingFile.current = null;

    const upload = fetcher.data.upload;
    const startedFor = selection.current;
    setUploading(true);
    putLessonAsset(upload, file)
      .then((assetKey) => {
        if (startedFor !== selection.current) return;
        onUploaded(assetKey, file.name);
      })
      .catch(() => {
        if (startedFor !== selection.current) return;
        setError("That upload did not go through. Try again.");
      })
      .finally(() => setUploading(false));
  }, [fetcher.state, fetcher.data, onUploaded]);

  if (source === "youtube") {
    const problem = urlTouched ? validateYoutubeUrl(url) : null;

    return (
      <div>
        <input
          value={url}
          onChange={(event) => {
            setUrlTouched(false);
            onUrlChange(event.target.value);
          }}
          onBlur={() => setUrlTouched(true)}
          placeholder={urlPlaceholder}
          aria-label={label}
          aria-invalid={Boolean(problem)}
          className={cn(
            "w-full rounded-lg border px-3.5 py-3 text-sm text-[#333333] outline-none",
            problem
              ? "border-[#FB3748]"
              : "border-[#E5E7EB] focus:border-[#1C5DD4]",
          )}
        />
        {problem && (
          <p className="mt-2 text-[13px] font-semibold text-[#FB3748]">
            {problem}
          </p>
        )}
      </div>
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
        onChange={(event) => accept(event.target.files?.[0])}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          accept(event.dataTransfer.files?.[0]);
        }}
        className={cn(
          "w-full cursor-pointer rounded-lg border-[1.5px] border-dashed p-7 text-center text-sm transition-colors",
          fileName
            ? "border-[#1C5DD4] bg-[#EFF4FE] text-[#1C5DD4]"
            : "border-[#E5E7EB] text-[#9A9AB0] hover:border-[#C9D6F2]",
        )}
      >
        {busy ? (
          <Loader2
            size={28}
            aria-hidden
            className="mx-auto mb-2.5 block animate-spin text-[#1C5DD4]"
          />
        ) : (
          <Upload
            size={28}
            strokeWidth={1.8}
            aria-hidden
            className={cn(
              "mx-auto mb-2.5 block",
              fileName ? "text-[#1C5DD4]" : "text-[#9CA3AF]",
            )}
          />
        )}
        {busy ? "Uploading…" : (fileName ?? LESSON_UPLOAD_HINTS[source])}
      </button>

      {error && (
        <p className="mt-2 text-[13px] font-semibold text-[#FB3748]">{error}</p>
      )}

      {fileName && !busy && (
        <button
          type="button"
          onClick={() => {
            setError(null);
            onClearFile();
          }}
          className="mt-2 cursor-pointer text-[13px] font-semibold text-[#9A9AB0] hover:text-[#DC2626]"
        >
          Remove file
        </button>
      )}
    </div>
  );
}
