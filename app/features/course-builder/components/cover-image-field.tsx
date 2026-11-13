import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { useImageDropPaste } from "~/hooks/use-image-drop-paste";
import { cn } from "~/lib/utils";
import {
  fetchImageAsFile,
  putCoverImage,
  validateCoverFile,
  type CoverUpload,
} from "../lib/upload-cover";

interface CoverImageFieldProps {
  previewUrl: string | null;
  /** Paints the dropzone red when the step is saved without a cover. */
  invalid?: boolean;
  onUploaded: (coverImageKey: string, previewUrl: string) => void;
}

type PresignResult =
  | { ok: true; intent: "presign-cover"; upload: CoverUpload }
  | { ok: false; error?: string };

export function CoverImageField({
  previewUrl,
  invalid = false,
  onUploaded,
}: CoverImageFieldProps) {
  const fetcher = useFetcher<PresignResult>();
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingFile = useRef<{ file: File; selection: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selection = useRef(0);
  const [uploadingFor, setUploadingFor] = useState<number | null>(null);
  const [fetchingFor, setFetchingFor] = useState<number | null>(null);
  const settle = (id: number) => (current: number | null) =>
    current === id ? null : current;

  const accept = (file: File | undefined, id = ++selection.current) => {
    if (!file) return;
    const problem = validateCoverFile(file);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    pendingFile.current = { file, selection: id };
    fetcher.submit(
      {
        intent: "presign-cover",
        contentType: file.type,
        fileSize: String(file.size),
      },
      { method: "post" },
    );
  };

  useEffect(() => {
    const pending = pendingFile.current;
    if (fetcher.state !== "idle" || !fetcher.data || !pending) return;

    pendingFile.current = null;
    const { file, selection: startedFor } = pending;
    if (startedFor !== selection.current) return;

    if (!fetcher.data.ok) {
      setError(fetcher.data.error ?? "That image could not be uploaded.");
      return;
    }

    const upload = fetcher.data.upload;
    setUploadingFor(startedFor);
    putCoverImage(upload, file)
      .then((key) => {
        if (startedFor !== selection.current) return;
        onUploaded(key, upload.publicUrl ?? URL.createObjectURL(file));
      })
      .catch(() => {
        if (startedFor !== selection.current) return;
        setError("That upload did not go through. Try again.");
      })
      .finally(() => setUploadingFor(settle(startedFor)));
  }, [fetcher.state, fetcher.data, onUploaded]);

  const busy =
    uploadingFor !== null || fetchingFor !== null || fetcher.state !== "idle";

  const drop = useImageDropPaste<HTMLDivElement>({
    onFiles: ([file]) => accept(file),
    onUrl: (url) => {
      const id = ++selection.current;
      setError(null);
      setFetchingFor(id);
      void fetchImageAsFile(url)
        .then((file) => {
          if (id !== selection.current) return;
          if (file) accept(file, id);
          else {
            setError(
              "That website does not let us copy its image. Save the image to your device, then upload it here.",
            );
          }
        })
        .finally(() => setFetchingFor(settle(id)));
    },
    disabled: busy,
  });

  return (
    <div ref={drop.ref} className="max-w-140" {...drop.dropZoneProps}>
      <div className="relative">
        {previewUrl ? (
          <div className="aspect-video overflow-hidden rounded-xl border border-[#E5E7EB]">
            <img src={previewUrl} alt="" className="size-full object-cover" />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="absolute top-3 right-3 cursor-pointer rounded-lg bg-[#1A1A2E]/85 px-4 py-2 text-[13px] font-bold text-white backdrop-blur-sm transition-colors hover:bg-[#1A1A2E] disabled:opacity-50"
            >
              Replace
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed bg-[#F4F4F5] transition-colors",
              drop.isDragging
                ? "border-[#1C5DD4] bg-[#F4F8FF]"
                : invalid
                  ? "border-[#FB3748]"
                  : "border-[#D1D5DB] hover:border-[#ACC5F4]",
            )}
          >
            <ImageIcon
              size={34}
              strokeWidth={1.5}
              aria-hidden
              className="text-[#9A9AB0]"
            />
            <span className="mt-1 text-[15px] text-[#6B7280]">
              Drag and drop or paste an image or image link here
            </span>
            <span className="text-[13px] text-[#6B7280]">
              or <span className="underline">browse files</span>
            </span>
          </button>
        )}

        {(busy || drop.isResolvingUrl) && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/70">
            <Loader2 size={20} className="animate-spin text-[#1C5DD4]" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => accept(event.target.files?.[0])}
      />

      {error && <p className="mt-1.5 text-[13px] text-[#FB3748]">{error}</p>}
    </div>
  );
}
