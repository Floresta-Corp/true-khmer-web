import type {
  CreateForumQuestionInput,
  ForumQuestionStatus,
} from "./forum-types";
import { z } from "zod";

export type ForumPostFormFieldErrors = Partial<
  Record<"categoryId" | "title" | "body" | "tags" | "status", string>
>;

type ValidateForumPostFormResult =
  | { success: true; data: CreateForumQuestionInput }
  | {
      success: false;
      fieldErrors: ForumPostFormFieldErrors;
      message: string;
    };

export const createForumPostSchema = z.object({
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
  imageKey: z.string().nullable(),
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
): CreateForumQuestionInput {
  const statusRaw = String(formData.get("status") ?? "PUBLISHED").toUpperCase();
  const status: ForumQuestionStatus =
    statusRaw === "DRAFT" ? "DRAFT" : "PUBLISHED";
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const tags = parseTags(formData);
  const imageKeyRaw = String(formData.get("imageKey") ?? "").trim();
  const imageKey: string | null = imageKeyRaw === "" ? null : imageKeyRaw;

  return {
    categoryId,
    title,
    body,
    tags,
    imageKey,
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

type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; message: string; fieldErrors: Record<string, string> };

/**
 * Validate a raw form-data record against a schema, returning the same
 * discriminated-union shape the workspace action consumes. `formData.get`
 * values are coerced to strings first so a missing field surfaces the
 * schema's own `min(1)` message rather than a "received null" type error.
 */
function validateFormFields<Schema extends z.ZodType>(
  schema: Schema,
  formData: FormData,
  fields: readonly string[],
): ValidationResult<z.infer<Schema>> {
  const raw: Record<string, string> = {};
  for (const field of fields) {
    raw[field] = String(formData.get(field) ?? "");
  }

  const parsed = schema.safeParse(raw);
  if (parsed.success) {
    return { success: true, data: parsed.data };
  }

  const flattened = parsed.error.flatten() as {
    fieldErrors: Record<string, string[] | undefined>;
  };
  const fieldErrors: Record<string, string> = {};
  for (const [key, messages] of Object.entries(flattened.fieldErrors)) {
    const first = messages?.[0];
    if (first) fieldErrors[key] = first;
  }

  return {
    success: false,
    fieldErrors,
    message:
      Object.values(fieldErrors)[0] ??
      parsed.error.issues[0]?.message ??
      "Invalid input.",
  };
}

const deleteAnswerSchema = z.object({
  answerId: z.string().trim().min(1, "Answer ID is required."),
});

const updateAnswerSchema = z.object({
  answerId: z.string().trim().min(1, "Answer ID is required."),
  body: z.string().trim().min(1, "Answer body is required."),
});

export function validateDeleteAnswerForm(formData: FormData) {
  return validateFormFields(deleteAnswerSchema, formData, ["answerId"]);
}

export function validateUpdateAnswerForm(formData: FormData) {
  return validateFormFields(updateAnswerSchema, formData, ["answerId", "body"]);
}

function makeQuestionIdValidator(message: string) {
  const schema = z.object({
    questionId: z.string().trim().min(1, message),
  });
  return (formData: FormData) =>
    validateFormFields(schema, formData, ["questionId"]);
}

export const validateDeleteQuestionForm = makeQuestionIdValidator(
  "Question ID is required for deleting.",
);

export const validateUpdateQuestionForm = makeQuestionIdValidator(
  "Question ID is required for updating.",
);
