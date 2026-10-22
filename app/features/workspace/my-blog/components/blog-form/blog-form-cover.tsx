import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { useImageDropPaste } from "~/hooks/use-image-drop-paste";
import { cn } from "~/lib/utils";
import { uploadBlogImage } from "../../lib/upload-blog-image";
import type { BlogFormState } from "./use-blog-form";
import { BlogFormCoverUrlDialog } from "./blog-form-cover-url-dialog";

const PICKER_BUTTON_CLASS =
  "h-12 rounded-[14px] border-slate-200 bg-white px-6 text-base text-slate-700 shadow-none hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white";

function isUsableImageUrl(value: string) {
  if (value.startsWith("/")) return true;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function BlogFormCover({ form }: { form: BlogFormState }) {
  const [isUrlDialogOpen, setIsUrlDialogOpen] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const { fields, isEditable, isUploadingCover, refs, setters } = form;

  async function uploadCoverFile(file: File) {
    setters.setIsUploadingCover(true);
    try {
      const uploaded = await uploadBlogImage(file);
      setters.setCoverImageKey(uploaded.imageKey);
      setters.setCoverImageUrl(uploaded.publicUrl ?? "");
      if (!fields.coverImageAlt.trim()) {
        setters.setCoverImageAlt(file.name.replace(/\.[^.]+$/, ""));
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to upload cover image.",
      );
    } finally {
      setters.setIsUploadingCover(false);
    }
  }

  function handleCoverUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) void uploadCoverFile(file);
  }

  function applyCoverUrl(url: string) {
    setters.setCoverImageKey(url);
    setters.setCoverImageUrl(url);
    if (!fields.coverImageAlt.trim()) {
      setters.setCoverImageAlt("Cover image");
    }
  }

  // Pasted/dropped links are stored as-is; only files go through the upload.
  const coverDrop = useImageDropPaste<HTMLDivElement>({
    onFiles: ([file]) => void uploadCoverFile(file),
    onUrl: applyCoverUrl,
    disabled: !isEditable || isUploadingCover,
  });

  function handleApplyCoverUrl() {
    const nextUrl = urlDraft.trim();
    if (!nextUrl) {
      toast.error("Enter an image URL before applying.");
      return;
    }
    if (!isUsableImageUrl(nextUrl)) {
      toast.error("Use a full https:// URL or a local image path.");
      return;
    }

    applyCoverUrl(nextUrl);
    setIsUrlDialogOpen(false);
  }

  function openUrlDialog() {
    setUrlDraft(fields.coverImageUrl);
    setIsUrlDialogOpen(true);
  }

  return (
    <>
      <input
        ref={refs.coverImageInputRef}
        hidden
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        onChange={handleCoverUpload}
        className="hidden"
      />

      <div className="mx-auto max-w-[1120px] space-y-4">
        <div
          ref={coverDrop.ref}
          {...coverDrop.dropZoneProps}
          className={cn(
            "rounded-[28px] transition-shadow",
            coverDrop.isDragging && "ring-4 ring-blue-500/40",
          )}
        >
          {fields.coverImageUrl ? (
            <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-950/60">
              <img
                src={fields.coverImageUrl}
                alt={fields.title || "Blog cover"}
                className="max-h-[520px] w-full object-cover"
              />

              {isEditable ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon-lg"
                      className="absolute top-4 right-4 rounded-full bg-white/92 text-[#181818] shadow-sm hover:bg-white"
                      aria-label="Open image options"
                    >
                      <MoreVertical className="h-5 w-5" aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem
                      onSelect={() => refs.coverImageInputRef.current?.click()}
                    >
                      Change image
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={openUrlDialog}>
                      Change by URL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setters.setShowImageCreditEditor(true)}
                    >
                      {fields.coverImageCaption
                        ? "Edit image credit"
                        : "Add image credit"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onSelect={() => {
                        setters.setCoverImageKey(null);
                        setters.setCoverImageUrl("");
                        setters.setCoverImageCaption("");
                        setters.setShowImageCreditEditor(false);
                      }}
                    >
                      Remove image
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </div>
          ) : (
            <div className="flex min-h-[440px] flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-950/50">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-slate-400 dark:text-slate-500">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-9 w-9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="16" rx="2.5" />
                  <path d="m7.5 14 2.8-2.8a1.5 1.5 0 0 1 2.1 0L16.5 15" />
                  <path d="m14 13 1-1a1.5 1.5 0 0 1 2.1 0l2.4 2.4" />
                  <circle cx="9" cy="9" r="1.2" />
                </svg>
              </div>
              <p className="text-[16px] font-medium text-slate-700 dark:text-slate-300">
                {!isEditable
                  ? "No cover photo"
                  : isUploadingCover
                    ? "Uploading cover image..."
                    : coverDrop.isResolvingUrl
                      ? "Checking image link..."
                      : "Add a cover photo"}
              </p>
              {isEditable ? (
                <>
                  <p className="mt-3 text-[14px] text-slate-500 dark:text-slate-400">
                    Will be cropped to a 3:2 aspect ratio
                  </p>
                  <p className="mt-1 text-[14px] text-slate-500 dark:text-slate-400">
                    Drag and drop, or paste an image or image link here
                  </p>
                </>
              ) : null}
              {isEditable ? (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => refs.coverImageInputRef.current?.click()}
                    className={PICKER_BUTTON_CLASS}
                  >
                    Upload
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={openUrlDialog}
                    className={PICKER_BUTTON_CLASS}
                  >
                    URL
                  </Button>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {!isEditable ? (
          fields.coverImageCaption ? (
            <p className="px-4 text-center text-sm text-slate-500 italic dark:text-slate-400">
              {fields.coverImageCaption}
            </p>
          ) : null
        ) : form.showImageCreditEditor || fields.coverImageCaption ? (
          <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-950/60">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              Image credit
            </p>
            <Input
              type="text"
              value={fields.coverImageCaption}
              onChange={(event) =>
                setters.setCoverImageCaption(event.target.value)
              }
              className="mt-1 border-0 bg-transparent px-0 text-sm text-slate-500 italic shadow-none focus-visible:ring-0 dark:bg-transparent dark:text-slate-400"
              placeholder="Photo by / Source"
            />
          </div>
        ) : null}
      </div>

      <BlogFormCoverUrlDialog
        isOpen={isUrlDialogOpen}
        value={urlDraft}
        onChange={setUrlDraft}
        onClose={() => setIsUrlDialogOpen(false)}
        onApply={handleApplyCoverUrl}
      />
    </>
  );
}
