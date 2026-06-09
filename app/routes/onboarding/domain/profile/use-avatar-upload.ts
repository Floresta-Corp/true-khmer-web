import { useCallback, useEffect, useRef, useState } from "react";
import {
  type PresignResponse,
  uploadToPresignedUrl,
} from "./profile-upload.client";

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // 5MB

type UseAvatarUploadOptions = {
  initialAvatarUrl: string;
  initialAvatarKey: string;
};

export function useAvatarUpload({
  initialAvatarUrl,
  initialAvatarKey,
}: UseAvatarUploadOptions) {
  const uploadTokenRef = useRef(0);
  const objectUrlRef = useRef<string | null>(null);

  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(initialAvatarUrl);
  const [avatarKey, setAvatarKey] = useState(initialAvatarKey);
  const [uploadError, setUploadError] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const revokeObjectUrl = useCallback(() => {
    if (!objectUrlRef.current) return;
    URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      revokeObjectUrl();
    };
  }, [revokeObjectUrl]);

  const handleAvatarChange = useCallback(
    async (file: File | null) => {
      setUploadError("");
      if (!file) {
        revokeObjectUrl();
        setAvatarPreviewUrl("");
        setAvatarKey("");
        setUploadProgress(null);
        return;
      }

      if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        setUploadError("Invalid file type. Use JPEG, PNG, or WebP.");
        setAvatarKey("");
        return;
      }

      if (file.size > MAX_AVATAR_BYTES) {
        setUploadError("Image must be 5MB or smaller.");
        setAvatarKey("");
        return;
      }

      const token = Date.now();
      uploadTokenRef.current = token;

      const preview = URL.createObjectURL(file);
      revokeObjectUrl();
      objectUrlRef.current = preview;

      setAvatarPreviewUrl(preview);
      setIsUploading(true);
      setUploadProgress(0);
      setAvatarKey("");

      try {
        const presignResponse = await fetch("/api/uploads/avatar/presign", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contentType: file.type,
            fileSize: file.size,
          }),
        });

        const presign = (await presignResponse
          .json()
          .catch(() => ({}))) as PresignResponse & {
            details?: { message?: string };
          };
        if (!presignResponse.ok || !presign.upload) {
          throw new Error(
            presign.message ||
            presign.details?.message ||
            "Upload unavailable, try again.",
          );
        }

        await uploadToPresignedUrl(presign.upload, file, (percent) => {
          if (uploadTokenRef.current !== token) return;
          setUploadProgress(percent);
        });

        if (uploadTokenRef.current !== token) return;
        setAvatarKey(presign.upload.avatarKey);
        setUploadProgress(100);
      } catch (error) {
        if (uploadTokenRef.current !== token) return;
        setAvatarKey("");
        setUploadError(
          error instanceof Error
            ? error.message
            : "Upload unavailable, try again.",
        );
      } finally {
        if (uploadTokenRef.current === token) {
          setIsUploading(false);
        }
      }
    },
    [revokeObjectUrl],
  );

  return {
    avatarPreviewUrl,
    avatarKey,
    uploadError,
    uploadProgress,
    isUploading,
    handleAvatarChange,
  };
}
