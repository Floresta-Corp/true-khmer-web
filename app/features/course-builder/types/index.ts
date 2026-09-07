import { z } from "zod";
import type {
  CourseLesson,
  CourseLevel,
  CourseSection,
} from "~/features/education/types";

export interface CourseDraft {
  title: string;
  description: string;
  categoryId: string;
  difficulty: CourseDifficulty | null;
  skills: string[];
  outcomes: string[];
  tags: string[];
  coverImageKey: string | null;
  coverPreviewUrl: string | null;
}

export type CourseDifficulty = CourseLevel | "All levels";

export interface DifficultyOption {
  value: CourseDifficulty;
  label: string;
  desc: string;
  bars: number;
}

export const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  {
    value: "Beginner",
    label: "Beginner",
    desc: "No prior experience",
    bars: 1,
  },
  {
    value: "Intermediate",
    label: "Intermediate",
    desc: "Some basics needed",
    bars: 2,
  },
  {
    value: "Advance",
    label: "Advance",
    desc: "Strong foundation",
    bars: 3,
  },
  {
    value: "All levels",
    label: "All levels",
    desc: "Suitable for anyone",
    bars: 3,
  },
];

export const BUILDER_STEPS = [
  "basic",
  "curriculum",
  "certificate",
  "quiz",
  "preview",
] as const;

export type BuilderStep = (typeof BUILDER_STEPS)[number];

export const BuilderStepSchema = z.enum(BUILDER_STEPS);

export function emptyDraft(): CourseDraft {
  return {
    title: "",
    description: "",
    categoryId: "",
    difficulty: null,
    skills: [],
    outcomes: [],
    tags: [],
    coverImageKey: null,
    coverPreviewUrl: null,
  };
}

export const COURSE_FORMATS = ["multi", "single"] as const;

export type CourseFormat = (typeof COURSE_FORMATS)[number];

export interface CourseFormatOption {
  value: CourseFormat;
  label: string;
  desc: string;
  badge: string | null;
}

export const LESSON_SOURCES = ["youtube", "pdf", "audio"] as const;

export type LessonSource = (typeof LESSON_SOURCES)[number];

export const LESSON_SOURCE_LABELS: Record<LessonSource, string> = {
  youtube: "YouTube link",
  pdf: "PDF",
  audio: "Audio",
};

export const LESSON_SOURCE_CARDS: Record<
  LessonSource,
  { label: string; desc: string }
> = {
  youtube: { label: "YouTube video", desc: "Link a video from YouTube" },
  pdf: { label: "PDF", desc: "Upload a PDF file" },
  audio: { label: "Audio", desc: "Upload an audio file" },
};

export const LESSON_SOURCE_SUBTITLES: Record<LessonSource, string> = {
  youtube: "Paste the link to the video learners will watch.",
  pdf: "Upload the PDF learners will read.",
  audio: "Upload the audio learners will listen to.",
};

export const LESSON_FIELD_LABELS: Record<LessonSource, string> = {
  youtube: "YouTube URL",
  pdf: "PDF file",
  audio: "Audio file",
};

export const LESSON_UPLOAD_HINTS: Record<
  Exclude<LessonSource, "youtube">,
  string
> = {
  pdf: "Drop a PDF here or click to browse",
  audio: "Drop an audio file here or click to browse",
};

export interface LessonDraft {
  title: string;
  source: LessonSource;
  url: string;
  fileName: string | null;
  assetKey: string | null;
}

export function lessonSourceChange(source: LessonSource): Partial<LessonDraft> {
  return { source, url: "", fileName: null, assetKey: null };
}

export function emptyLessonDraft(): LessonDraft {
  return {
    title: "",
    source: "youtube",
    url: "",
    fileName: null,
    assetKey: null,
  };
}

export interface BuilderLesson extends CourseLesson {
  url: string | null;
  assetKey: string | null;
}

export interface BuilderSection extends CourseSection {
  lessons: BuilderLesson[];
}

/** A saved lesson, in the shape the add/edit lesson form works in. */
export function lessonDraftOf(lesson: BuilderLesson): LessonDraft {
  return {
    title: lesson.title,
    source:
      lesson.type === "pdf"
        ? "pdf"
        : lesson.type === "audio"
          ? "audio"
          : "youtube",
    url: lesson.url ?? "",
    fileName: lesson.assetKey
      ? (lesson.assetKey.split("/").pop() ?? null)
      : null,
    assetKey: lesson.assetKey ?? null,
  };
}

/** The lesson type a draft's chosen source maps to. */
export function lessonTypeOf(source: LessonSource): BuilderLesson["type"] {
  return source === "youtube" ? "video" : source;
}

export type LessonApiType = "YOUTUBE" | "PDF" | "AUDIO";

export function lessonApiType(lesson: BuilderLesson): LessonApiType {
  if (lesson.type === "pdf") return "PDF";
  if (lesson.type === "audio") return "AUDIO";
  return "YOUTUBE";
}

export const DIFFICULTY_API_VALUE: Record<
  CourseDifficulty,
  "BEGINNER" | "INTERMEDIATE" | "ADVANCE" | "ALL_LEVELS"
> = {
  Beginner: "BEGINNER",
  Intermediate: "INTERMEDIATE",
  Advance: "ADVANCE",
  "All levels": "ALL_LEVELS",
};

export const CERTIFICATE_API_VALUE: Record<
  CertificateKind,
  "PARTICIPATION" | "COMPLETION"
> = {
  participation: "PARTICIPATION",
  completion: "COMPLETION",
};

export interface QuizAnswer {
  id: string;
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  id: string;
  text: string;
  answers: QuizAnswer[];
}

export const DEFAULT_ANSWER_COUNT = 4;
export const MAX_ANSWER_COUNT = 6;

export const CERTIFICATE_KINDS = ["participation", "completion"] as const;

export type CertificateKind = (typeof CERTIFICATE_KINDS)[number];

export interface CategoryOption {
  value: string;
  label: string;
}
