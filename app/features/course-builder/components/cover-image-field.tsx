import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  putCoverImage,
  validateCoverFile,
  type CoverUpload,
} from "../lib/upload-cover";

interface CoverImageFieldProps {
  previewUrl: string | null;
  onUploaded: (coverImageKey: string, previewUrl: string) => void;
  onClear: () => void;
}

type PresignResult = { ok: true; intent: "presign-cover"; upload: CoverUpload };

/**
 * The design's 16/9 cover well. Picking a file presigns through our action,
 * then PUTs straight to storage; only the returned key is saved on the course.
 */
export function CoverImageField({
  previewUrl,
  onUploaded,
  onClear,
}: CoverImageFieldProps) {
  const fetcher = useFetcher<PresignResult>();
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingFile = useRef<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const accept = (file: File | undefined) => {
    if (!file) return;
    const problem = validateCoverFile(file);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    pendingFile.current = file;
    fetcher.submit(
      {
        intent: "presign-cover",
        contentType: file.type,
        fileSize: String(file.size),
      },
      { method: "post" },
    );
  };

  // The presigned URL comes back through the action; the PUT happens here.
  useEffect(() => {
    const file = pendingFile.current;
    if (fetcher.state !== "idle" || !fetcher.data?.upload || !file) return;
    pendingFile.current = null;

    const upload = fetcher.data.upload;
    setUploading(true);
    putCoverImage(upload, file)
      .then((key) => {
        onUploaded(key, upload.publicUrl ?? URL.createObjectURL(file));
      })
      .catch(() => setError("That upload did not go through. Try again."))
      .finally(() => setUploading(false));
  }, [fetcher.state, fetcher.data, onUploaded]);

  const busy = uploading || fetcher.state !== "idle";

  return (
    <div className="max-w-[360px]">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          accept(event.dataTransfer.files[0]);
        }}
        className={cn(
          "relative aspect-video overflow-hidden rounded-lg bg-[#E8E8E8]",
          dragging && "ring-2 ring-[#1C5DD4] ring-offset-2",
        )}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="" className="size-full object-cover" />
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex size-full cursor-pointer flex-col items-center justify-center gap-2 text-[#9A9AB0]"
          >
            <ImagePlus size={22} aria-hidden />
            <span className="text-[13px] font-medium">
              Drag and drop an image here
            </span>
          </button>
        )}

        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
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

      <div className="mt-2 flex items-center gap-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="cursor-pointer text-[13px] font-semibold text-[#1C5DD4] hover:underline disabled:opacity-50"
        >
          {previewUrl ? "Replace image" : "Choose an image"}
        </button>
        {previewUrl && (
          <button
            type="button"
            onClick={onClear}
            className="flex cursor-pointer items-center gap-1 text-[13px] font-semibold text-[#9A9AB0] hover:text-[#FB3748]"
          >
            <Trash2 size={13} aria-hidden />
            Remove
          </button>
        )}
      </div>

      {error && <p className="mt-1.5 text-[13px] text-[#FB3748]">{error}</p>}
    </div>
  );
}
