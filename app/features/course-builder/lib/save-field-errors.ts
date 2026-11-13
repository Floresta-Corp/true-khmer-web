export type SaveStage = "course" | "meta" | "curriculum" | "quiz" | "submit";

export interface SaveIssue {
  path: Array<string | number>;
  message: string;
}

export interface SentCurriculum {
  chapters: Array<{ title: string; lessons: Array<{ title: string }> }>;
}

export interface PlacedErrors {
  fieldErrors: Record<string, string[]>;
  unplaced: string[];
}

export const FIELD_STEP = {
  title: "basic",
  description: "basic",
  categoryId: "basic",
  difficulty: "basic",
  outcomes: "basic",
  skills: "basic",
  tags: "basic",
  coverImageKey: "basic",
  curriculum: "curriculum",
  quiz: "quiz",
} as const;

export type BuilderField = keyof typeof FIELD_STEP;

const COURSE_FIELDS = new Set<string>([
  "title",
  "description",
  "categoryId",
  "coverImageKey",
  "difficulty",
  "outcomes",
  "skills",
  "tags",
]);

const PLAIN_MESSAGES: Partial<Record<string, string>> = {
  coverImageKey:
    "Upload the cover image again from your device. Image links from other websites can't be used.",
};

const LIST_ITEM_NOUN: Record<string, string> = {
  outcomes: "Outcome",
  skills: "Skill",
  tags: "Tag",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toPath(value: unknown): Array<string | number> {
  if (Array.isArray(value)) {
    return value.filter(
      (part): part is string | number =>
        typeof part === "string" || typeof part === "number",
    );
  }
  if (typeof value === "string" && value) {
    return value.split(".").map((part) => (/^\d+$/.test(part) ? +part : part));
  }
  return [];
}

function toIssue(value: unknown): SaveIssue | null {
  if (typeof value === "string" && value) return { path: [], message: value };
  if (isRecord(value) && typeof value.message === "string") {
    return { path: toPath(value.path), message: value.message };
  }
  return null;
}

export function readApiIssues(details: unknown): SaveIssue[] {
  if (!isRecord(details)) return [];

  if (Array.isArray(details.issues)) {
    return details.issues
      .map(toIssue)
      .filter((issue): issue is SaveIssue => issue !== null);
  }

  const error = details.error;
  if (
    isRecord(error) &&
    error.name === "ZodError" &&
    typeof error.message === "string"
  ) {
    try {
      const decoded: unknown = JSON.parse(error.message);
      if (Array.isArray(decoded)) {
        return decoded
          .map(toIssue)
          .filter((issue): issue is SaveIssue => issue !== null);
      }
    } catch {
      return [{ path: [], message: error.message }];
    }
  }

  return [];
}

function sentence(message: string) {
  const trimmed = message.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function quoted(title: string | undefined, fallback: string) {
  const clean = title?.trim();
  return clean ? `“${clean}”` : fallback;
}

function curriculumPlace(
  path: Array<string | number>,
  sent: SentCurriculum | undefined,
): string | null {
  const [root, sectionIndex, child, lessonIndex] = path;
  if (root !== "chapters" || typeof sectionIndex !== "number") return null;

  const section = sent?.chapters[sectionIndex];
  const sectionName = `Section ${quoted(section?.title, String(sectionIndex + 1))}`;

  if (child !== "lessons" || typeof lessonIndex !== "number") {
    return sectionName;
  }

  const lesson = section?.lessons[lessonIndex];
  return `${sectionName}, lesson ${quoted(lesson?.title, String(lessonIndex + 1))}`;
}

export function placeSaveIssues(
  stage: SaveStage,
  issues: SaveIssue[],
  sent?: SentCurriculum,
  /** The builder's Q-number for each sent question, by sent position. */
  questionNumbers?: number[],
): PlacedErrors {
  const fieldErrors: Record<string, string[]> = {};
  const unplaced: string[] = [];

  const add = (field: BuilderField, message: string) => {
    (fieldErrors[field] ??= []).push(message);
  };

  for (const issue of issues) {
    const message = sentence(issue.message);
    const [root, index] = issue.path;

    if (stage === "curriculum") {
      const place = curriculumPlace(issue.path, sent);
      add("curriculum", place ? `${place}: ${issue.message}` : message);
      continue;
    }

    if (stage === "quiz") {
      add(
        "quiz",
        root === "questions" && typeof index === "number"
          ? `Question ${questionNumbers?.[index] ?? index + 1}: ${issue.message}`
          : message,
      );
      continue;
    }

    if (
      (stage === "course" || stage === "meta") &&
      typeof root === "string" &&
      COURSE_FIELDS.has(root)
    ) {
      const noun = LIST_ITEM_NOUN[root];
      add(
        root as BuilderField,
        PLAIN_MESSAGES[root] ??
          (noun && typeof index === "number"
            ? `${noun} ${index + 1}: ${issue.message}`
            : message),
      );
      continue;
    }

    unplaced.push(message);
  }

  return { fieldErrors, unplaced };
}
