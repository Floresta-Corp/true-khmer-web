import { z } from "zod";
import type { CourseLevel } from "~/features/education/types";

/**
 * The builder's wizard state.
 *
 * Only `title`, `description`, `categoryId` and `coverImageKey` have somewhere
 * to go on the API today (see `createCourse`). The rest is held here so the UI
 * matches the design and is ready to persist once the endpoints exist.
 */
export interface CourseDraft {
  title: string;
  description: string;
  categoryId: string;
  difficulty: CourseDifficulty | null;
  skills: string[];
  tags: string[];
  coverImageKey: string | null;
  coverPreviewUrl: string | null;
}

/**
 * The design offers four difficulty cards. `CourseLevel` — what a course card
 * renders — has three, so "All levels" maps to no single level.
 */
export type CourseDifficulty = CourseLevel | "All levels";

export interface DifficultyOption {
  value: CourseDifficulty;
  label: string;
  desc: string;
  /** Filled bars in the level meter; "All levels" shows all three. */
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
  "quiz",
  "certificate",
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
    tags: [],
    coverImageKey: null,
    coverPreviewUrl: null,
  };
}

/**
 * How the course content is organized — the "Course structure" choice on the
 * Curriculum step. The design offers two, with the multi-section one
 * recommended.
 */
export const COURSE_FORMATS = ["multi", "single"] as const;

export type CourseFormat = (typeof COURSE_FORMATS)[number];

export interface CourseFormatOption {
  value: CourseFormat;
  label: string;
  desc: string;
  badge: string | null;
}

/* -------------------------------- Quiz ----------------------------------- */

/** A course has a single quiz, sat at the end. */
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

/** The design's answer list caps out; four choices is its placeholder count. */
export const DEFAULT_ANSWER_COUNT = 4;
export const MAX_ANSWER_COUNT = 6;

/* ----------------------------- Certificate ------------------------------- */

export const CERTIFICATE_KINDS = ["participation", "completion"] as const;

export type CertificateKind = (typeof CERTIFICATE_KINDS)[number];

/** A category as the builder's select needs it. */
export interface CategoryOption {
  value: string;
  label: string;
}
