export interface UploadedBlogImage {
  imageKey: string;
  publicUrl: string | null;
}

export async function uploadBlogImage(file: File): Promise<UploadedBlogImage> {
  const presignRes = await fetch("/api/admin/blog/image-presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType: file.type, fileSize: file.size }),
  });
  const presignJson = await presignRes.json();
  if (!presignRes.ok || !presignJson.ok) {
    throw new Error(presignJson.error || "Failed to get upload URL");
  }

  const { uploadUrl, requiredHeaders, imageKey, publicUrl } =
    presignJson.upload;

  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: requiredHeaders,
    body: file,
  });
  if (!putRes.ok) {
    throw new Error("Upload failed");
  }

  return { imageKey, publicUrl };
}
