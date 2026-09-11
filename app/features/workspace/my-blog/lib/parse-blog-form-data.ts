import type { UpdateBlogPostRequest } from "~/types/api-client";

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

/**
 * The author owns the writing fields only. The byline comes from the account
 * that wrote the blog, and status, placement and featuring are moderator
 * decisions made through the admin endpoints.
 */
export function parseBlogPostFormData(
  formData: FormData,
): UpdateBlogPostRequest {
  return {
    title: readString(formData, "title") ?? "Untitled Draft",
    excerpt: readString(formData, "excerpt") ?? "",
    authorRole: readString(formData, "authorRole") ?? null,
    tags: readTags(formData),
    categoryId: readString(formData, "categoryId") ?? null,
    coverImageKey: readString(formData, "coverImageKey") ?? null,
    coverImageAlt: readString(formData, "coverImageAlt") ?? null,
    coverImageCaption: readString(formData, "coverImageCaption") ?? null,
    content: readString(formData, "content") ?? "",
  };
}
