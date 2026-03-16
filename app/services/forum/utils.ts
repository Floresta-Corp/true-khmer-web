import type { CreateForumPostInput, ForumPostStatus } from "./types";

function parseTags(formData: FormData): string[] {
  const directTags = formData
    .getAll("tags")
    .map((value) => String(value).trim())
    .filter(Boolean);

  const bracketTags = formData
    .getAll("tags[]")
    .map((value) => String(value).trim())
    .filter(Boolean);

  const combined = [...directTags, ...bracketTags];
  if (combined.length > 0) return combined;

  const tags = formData.get("tags");
  if (!tags) return [];

  const rawTags = String(tags).trim();
  if (!rawTags) return [];

  try {
    const parsed = JSON.parse(rawTags);
    if (Array.isArray(parsed)) {
      return parsed.map((value) => String(value).trim()).filter(Boolean);
    }
  } catch {
    // Fall through to comma-separated parsing.
  }

  return rawTags
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

export function parseCreateForumPostForm(
  formData: FormData,
): CreateForumPostInput {
  const statusRaw = String(formData.get("status") ?? "PUBLISHED").toUpperCase();
  const status: ForumPostStatus = statusRaw === "DRAFT" ? "DRAFT" : "PUBLISHED";

  return {
    categoryId: String(formData.get("categoryId") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    body: String(formData.get("body") ?? "").trim(),
    tags: parseTags(formData),
    status,
  };
}
