export interface ParsedBlogPostFormData {
  title: string;
  excerpt: string;
  authorName: string;
  authorRole: string | null;
  tags: string[];
  categoryId: string | null;
  placement: "HOME" | "CONTACT" | "NONE";
  coverImageKey: string | null;
  coverImageAlt: string | null;
  coverImageCaption: string | null;
  content: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

function readString(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return typeof value === "string" && value !== "" ? value : undefined;
}

function readTags(formData: FormData): string[] {
  const raw = formData.get("tags");
  if (typeof raw !== "string" || !raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((tag): tag is string => typeof tag === "string")
      : [];
  } catch {
    return [];
  }
}

export function parseBlogPostFormData(
  formData: FormData,
): ParsedBlogPostFormData {
  return {
    title: readString(formData, "title") ?? "Untitled Draft",
    excerpt: readString(formData, "excerpt") ?? "",
    authorName: readString(formData, "authorName") ?? "",
    authorRole: readString(formData, "authorRole") ?? null,
    tags: readTags(formData),
    categoryId: readString(formData, "categoryId") ?? null,
    placement: (readString(formData, "placement") ?? "HOME") as
      | "HOME"
      | "CONTACT"
      | "NONE",
    coverImageKey: readString(formData, "coverImageKey") ?? null,
    coverImageAlt: readString(formData, "coverImageAlt") ?? null,
    coverImageCaption: readString(formData, "coverImageCaption") ?? null,
    content: readString(formData, "content") ?? "",
    status: (readString(formData, "status") ?? "DRAFT") as
      | "DRAFT"
      | "PUBLISHED"
      | "ARCHIVED",
  };
}
