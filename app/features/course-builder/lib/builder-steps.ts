import {
  Award,
  BookOpen,
  FileText,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import { BUILDER_STEPS, type BuilderStep } from "../types";

export interface StepDefinition {
  id: BuilderStep;
  /** Rail label. */
  label: string;
  /** Rail sub-label. */
  desc: string;
  icon: LucideIcon;
  /** Heading and sub-heading above the step's fields. */
  heading: string;
  subheading: string;
}

export const STEP_DEFINITIONS: Record<BuilderStep, StepDefinition> = {
  basic: {
    id: "basic",
    label: "Basic information",
    desc: "Title, category and cover",
    icon: FileText,
    heading: "Basic information",
    subheading: "Tell learners what this course is and who it is for.",
  },
  curriculum: {
    id: "curriculum",
    label: "Curriculum",
    desc: "Sections and lessons",
    icon: BookOpen,
    heading: "Curriculum",
    subheading: "Choose a structure, then add your sections and lessons.",
  },
  quiz: {
    id: "quiz",
    label: "Quiz",
    desc: "Questions and passing score",
    icon: HelpCircle,
    heading: "Quiz",
    subheading: "Set up how learners are tested on this course.",
  },
  certificate: {
    id: "certificate",
    label: "Certificate",
    desc: "What learners earn",
    icon: Award,
    heading: "Certificate",
    subheading: "Choose the certificate learners receive.",
  },
  preview: {
    id: "preview",
    label: "Preview & submit",
    desc: "Review before sending",
    icon: FileText,
    heading: "Preview & submit",
    subheading: "Check everything over, then send it for review.",
  },
};

export const STEP_ORDER = BUILDER_STEPS;

export function stepIndex(step: BuilderStep) {
  return STEP_ORDER.indexOf(step);
}

export function nextStep(step: BuilderStep): BuilderStep | null {
  return STEP_ORDER[stepIndex(step) + 1] ?? null;
}

export function previousStep(step: BuilderStep): BuilderStep | null {
  return stepIndex(step) > 0 ? STEP_ORDER[stepIndex(step) - 1] : null;
}
