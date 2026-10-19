import { Camera } from "lucide-react";
import { useRef } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useImageDropPaste } from "~/hooks/use-image-drop-paste";
import { cn } from "~/lib/utils";

type ProfilePhotoUploadProps = {
  avatarPreviewUrl: string;
  placeholderInitials: string;
  isUploading: boolean;
  uploadProgress: number | null;
  avatarKey: string;
  uploadError: string;
  onAvatarChange: (file: File | null) => void;
  onAvatarUrl: (url: string) => void;
};

export function ProfilePhotoUpload({
  avatarPreviewUrl,
  placeholderInitials,
  isUploading,
  uploadProgress,
  avatarKey,
  uploadError,
  onAvatarChange,
  onAvatarUrl,
}: ProfilePhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const drop = useImageDropPaste<HTMLDivElement>({
    onFiles: ([file]) => onAvatarChange(file),
    onUrl: onAvatarUrl,
  });

  return (
    <div className="space-y-7">
      <div
        ref={drop.ref}
        {...drop.dropZoneProps}
        className={cn(
          "-m-2 inline-flex items-center gap-5 rounded-2xl border border-dashed border-transparent p-2 transition-colors",
          drop.isDragging && "border-[#2F6FE4] bg-[#EFF6FF]",
        )}
      >
        <div className="relative h-24 w-24">
          {avatarPreviewUrl ? (
            <img
              src={avatarPreviewUrl}
              alt="Profile preview"
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#2F58DA] text-2xl leading-8 font-normal tracking-tight text-white">
              {placeholderInitials}
            </div>
          )}

          <Input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) =>
              onAvatarChange(event.currentTarget.files?.[0] ?? null)
            }
          />

          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="icon"
            className="absolute right-0 bottom-0 h-8 w-8 rounded-full border-2 border-[#E5E7EB] bg-white text-[#4A5565] hover:bg-slate-50"
            aria-label="Upload profile photo"
          >
            <Camera size={16} />
          </Button>
        </div>

        <div className="flex-1 space-y-1">
          <h2 className="text-base leading-6 font-medium text-[#101828]">
            Add a profile photo
          </h2>
          <p className="text-sm leading-5.25 font-normal text-[#1414145C]">
            Members with photos get 3× more engagement. <br />
            <span className="font-bold text-[#2F6FE4]">+10 points</span> for
            completing your profile.
          </p>
          <p className="text-xs text-[#1414145C]">
            {drop.isResolvingUrl
              ? "Checking image link…"
              : "Drag and drop, or paste an image or image link here."}
          </p>
          {isUploading && uploadProgress !== null ? (
            <p className="text-xs text-[#2F6FE4]">
              Uploading... {uploadProgress}%
            </p>
          ) : null}
          {avatarKey && !isUploading ? (
            <p className="text-xs text-emerald-600">Avatar ready.</p>
          ) : null}
          {uploadError ? (
            <p className="text-xs text-red-500">{uploadError}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
