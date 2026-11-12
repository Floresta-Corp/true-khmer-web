import { useEffect, useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { useFetcher } from "react-router";
import { useFileDropPaste } from "~/hooks/use-image-drop-paste";
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
import {
  parseVideoSource,
  validateVideoUrl,
  videoSourceKey,
} from "~/features/education/lib/video-source";
import { measureVideoUrlDuration } from "../lib/video-file-duration";
import {
  readLessonAssetMeta,
  type LessonAssetMeta,
} from "../lib/lesson-asset-meta";

const ACCEPT: Record<Exclude<LessonSource, "video">, string> = {
  pdf: "application/pdf",
  audio: "audio/*",
};

type PresignResult =
  | { ok: true; intent: "presign-lesson"; upload: LessonAssetUpload }
  | { ok: false; error?: string };

type DurationResult =
  | {
      ok: true;
      intent: "video-duration";
      videoKey: string;
      durationSeconds: number;
    }
  | { ok: false; error?: string };

const LOOKUP_DEBOUNCE_MS = 400;

interface LessonSourceFieldProps {
  source: LessonSource;
  url: string;
  fileName: string | null;
  urlPlaceholder: string;
  urlHint?: string;
  onUrlChange: (url: string) => void;
  onUploaded: (
    assetKey: string,
    fileName: string,
    meta: LessonAssetMeta,
  ) => void;
  onClearFile: () => void;
  onUploadingChange?: (uploading: boolean) => void;
  /** The length already known for this source, shown while the field is open. */
  durationSeconds: number | null;
  onDurationChange: (durationSeconds: number | null) => void;
  label: string;
}

export function LessonSourceField({
  source,
  url,
  fileName,
  urlPlaceholder,
  urlHint,
  onUrlChange,
  onUploaded,
  onClearFile,
  onUploadingChange,
  durationSeconds,
  onDurationChange,
  label,
}: LessonSourceFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fetcher = useFetcher<PresignResult>();
  const pendingFile = useRef<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlTouched, setUrlTouched] = useState(false);

  const selection = useRef(0);

  const lookup = useFetcher<DurationResult>();
  const { submit: submitLookup } = lookup;
  const video = source === "video" ? parseVideoSource(url) : null;
  const videoId = video ? videoSourceKey(video) : null;
  const lengthSource =
    video?.platform === "youtube" || video?.platform === "vimeo"
      ? "server"
      : video?.platform === "file"
        ? "browser"
        : "none";
  const askedFor = useRef<string | null>(null);
  /** The video whose answer is already in the draft. */
  const [resolvedFor, setResolvedFor] = useState<string | null>(() =>
    durationSeconds ? videoId : null,
  );
  /* Held in a ref so the effects below do not restart on every parent render. */
  const durationSink = useRef(onDurationChange);
  useEffect(() => {
    durationSink.current = onDurationChange;
  }, [onDurationChange]);

  const readingLength = Boolean(videoId) && videoId !== resolvedFor;
  const busy = uploading || fetcher.state !== "idle";
  const working = busy || readingLength;

  useEffect(() => {
    onUploadingChange?.(working);
  }, [working, onUploadingChange]);

  useEffect(() => {
    selection.current += 1;
    pendingFile.current = null;
    setError(null);
  }, [source]);

  useEffect(() => {
    if (source !== "video" || videoId === resolvedFor) return;
    if (durationSeconds !== null) durationSink.current(null);
  }, [source, videoId, resolvedFor, durationSeconds]);

  useEffect(() => {
    if (!videoId || videoId === askedFor.current) return;

    if (lengthSource === "none") {
      askedFor.current = videoId;
      setResolvedFor(videoId);
      durationSink.current(null);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      askedFor.current = videoId;

      if (lengthSource === "server") {
        submitLookup(
          { intent: "video-duration", url: url.trim() },
          { method: "post" },
        );
        return;
      }

      void measureVideoUrlDuration(url.trim()).then((seconds) => {
        if (cancelled || askedFor.current !== videoId) return;
        setResolvedFor(videoId);
        durationSink.current(seconds);
      });
    }, LOOKUP_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [videoId, lengthSource, url, submitLookup]);

  useEffect(() => {
    const answer = lookup.data;
    const asked = askedFor.current;
    if (lookup.state !== "idle" || !answer || !asked || asked === resolvedFor) {
      return;
    }
    if (answer.ok && answer.videoKey !== asked) return;

    setResolvedFor(asked);
    durationSink.current(answer.ok ? answer.durationSeconds : null);
  }, [lookup.state, lookup.data, resolvedFor]);

  const accept = (file: File | undefined) => {
    if (!file || source === "video") return;

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
    Promise.all([
      putLessonAsset(upload, file),
      readLessonAssetMeta(file, source),
    ])
      .then(([assetKey, meta]) => {
        if (startedFor !== selection.current) return;
        onUploaded(assetKey, file.name, meta);
      })
      .catch(() => {
        if (startedFor !== selection.current) return;
        setError("That upload did not go through. Try again.");
      })
      .finally(() => setUploading(false));
  }, [fetcher.state, fetcher.data, onUploaded, source]);

  const drop = useFileDropPaste<HTMLButtonElement>({
    onFiles: ([file]) => accept(file),
    disabled: busy || source === "video",
  });

  if (source === "video") {
    const problem = urlTouched ? validateVideoUrl(url) : null;

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
        {problem ? (
          <p className="mt-2 text-[13px] font-semibold text-[#FB3748]">
            {problem}
          </p>
        ) : (
          urlHint && (
            <p className="mt-2 text-[13px] text-[#9A9AB0]">{urlHint}</p>
          )
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
        ref={drop.ref}
        {...drop.dropZoneProps}
        className={cn(
          "w-full cursor-pointer rounded-lg border-[1.5px] border-dashed p-7 text-center text-sm transition-colors",
          drop.isDragging
            ? "border-[#1C5DD4] bg-[#F4F8FF] text-[#1C5DD4]"
            : fileName
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
