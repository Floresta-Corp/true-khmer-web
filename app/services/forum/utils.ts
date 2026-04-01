import type { CreateForumPostInput, ForumQuestionStatus } from "./types";
import { z } from "zod";

export type ForumPostFormFieldErrors = Partial<
  Record<"categoryId" | "title" | "body" | "tags" | "status", string>
>;

type ValidateForumPostFormResult =
  | { success: true; data: CreateForumPostInput }
  | {
    success: false;
    fieldErrors: ForumPostFormFieldErrors;
    message: string;
  };

const createForumPostSchema = z.object({
  categoryId: z.string().min(1, "Please select a category."),
  title: z
    .string()
    .min(5, "Title must be at least 5 characters.")
    .max(200, "Title must be at most 200 characters."),
  body: z
    .string()
    .min(5, "Discussion details must be at least 5 characters.")
    .max(5000, "Discussion details must be at most 5000 characters."),
  tags: z
    .array(z.string().trim().min(1))
    .max(5, "You can add up to 5 tags only."),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

function parseTags(formData: FormData): string[] {
  const splitAndClean = (values: string[]): string[] =>
    values
      .flatMap((value) => value.split(","))
      .map((value) => value.trim())
      .filter(Boolean);

  const directTags = formData
    .getAll("tags")
    .map((value) => String(value).trim())
    .filter(Boolean);

  const bracketTags = formData
    .getAll("tags[]")
    .map((value) => String(value).trim())
    .filter(Boolean);

  const combined = splitAndClean([...directTags, ...bracketTags]);
  if (combined.length > 0) return combined;

  const tags = formData.get("tags");
  if (!tags) return [];

  const rawTags = String(tags).trim();
  if (!rawTags) return [];

  try {
    const parsed = JSON.parse(rawTags);
    if (Array.isArray(parsed)) {
      return splitAndClean(parsed.map((value) => String(value)));
    }
  } catch {
    // Fall through to comma-separated parsing.
  }

  return splitAndClean([rawTags]);
}

export function parseCreateForumPostForm(
  formData: FormData,
): CreateForumPostInput {
  const statusRaw = String(formData.get("status") ?? "PUBLISHED").toUpperCase();
  const status: ForumQuestionStatus = statusRaw === "DRAFT" ? "DRAFT" : "PUBLISHED";
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const tags = parseTags(formData);
  console.log({ tags })
  return {
    categoryId,
    title,
    body,
    tags,
    status,
  };
}

export function validateCreateForumPostForm(
  formData: FormData,
): ValidateForumPostFormResult {
  const payload = parseCreateForumPostForm(formData);
  const parsed = createForumPostSchema.safeParse(payload);

  if (parsed.success) {
    return { success: true, data: parsed.data };
  }

  const flattened = parsed.error.flatten();

  const fieldErrors: ForumPostFormFieldErrors = {
    categoryId: flattened.fieldErrors.categoryId?.[0],
    title: flattened.fieldErrors.title?.[0],
    body: flattened.fieldErrors.body?.[0],
    tags: flattened.fieldErrors.tags?.[0],
    status: flattened.fieldErrors.status?.[0],
  };

  return {
    success: false,
    fieldErrors,
    message: "Please fix the highlighted fields and try again.",
  };
}
