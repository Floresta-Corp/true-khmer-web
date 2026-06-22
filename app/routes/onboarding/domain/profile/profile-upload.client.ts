export type PresignResponse = {
  ok?: boolean;
  message?: string;
  upload?: {
    uploadUrl: string;
    method: "PUT" | string;
    requiredHeaders?: Record<string, string>;
    avatarKey: string;
    expiresInSeconds?: number;
  };
};

export function uploadToPresignedUrl(
  upload: NonNullable<PresignResponse["upload"]>,
  file: File,
  onProgress: (percent: number) => void,
) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const method = upload.method?.toUpperCase() || "PUT";
    xhr.open(method, upload.uploadUrl, true);

    const requiredHeaders = upload.requiredHeaders ?? {};
    Object.entries(requiredHeaders).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });
    const hasContentTypeHeader = Object.keys(requiredHeaders).some(
      (key) => key.toLowerCase() === "content-type",
    );
    if (!hasContentTypeHeader) {
      xhr.setRequestHeader("Content-Type", file.type);
    }

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const percent = Math.round((event.loaded / event.total) * 100);
      onProgress(percent);
    };

    xhr.onerror = () =>
      reject(
        new Error(
          "Upload failed due to a network error. This may be caused by CORS configuration, network connectivity, or other issues.",
        ),
      );
    xhr.onabort = () => reject(new Error("Upload was cancelled."));
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        const reason = xhr.responseText?.slice(0, 300);
        reject(
          new Error(
            reason
              ? `Upload failed (${xhr.status}): ${reason}`
              : `Upload failed with status ${xhr.status}`,
          ),
        );
      }
    };

    xhr.send(file);
  });
}
