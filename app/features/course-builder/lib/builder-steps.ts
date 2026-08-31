import {
  Award,
  BookOpen,
  Eye,
  FileText,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import type { BuilderStep, CertificateKind, CourseFormat } from "../types";

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
    label: "Course Details",
    desc: "Add the essentials about your course",
    icon: FileText,
    heading: "Course Details",
    subheading: "Add the essential details about your course.",
  },
  curriculum: {
    id: "curriculum",
    label: "Curriculum",
    desc: "Add sections and lessons.",
    icon: BookOpen,
    heading: "Curriculum",
    subheading: "Organize your course into sections and lessons.",
  },
  certificate: {
    id: "certificate",
    label: "Certificate",
    desc: "Choose how learners can earn a certificate for this course.",
    icon: Award,
    heading: "Certificate",
    subheading: "Choose how learners can earn a certificate for this course.",
  },
  quiz: {
    id: "quiz",
    label: "Quizzes & Assessment",
    desc: "Write questions to test learners.",
    icon: HelpCircle,
    heading: "Quizzes & Assessment",
    subheading: "Write the questions learners will answer.",
  },
  preview: {
    id: "preview",
    label: "Review and submit",
    desc: "See how your course will appear to learners.",
    icon: Eye,
    heading: "Review and submit",
    subheading: "See how your course will appear to learners.",
  },
};

/**
 * The steps this course actually has.
 *
 * The design builds the list conditionally: a single-lesson course has no
 * Certificate step, and the Quiz step exists only when the certificate is one
 * of completion — a participation certificate is earned by finishing the
 * lessons, so there is nothing to be assessed on.
 */
export function visibleSteps(
  format: CourseFormat,
  certificate: CertificateKind,
): BuilderStep[] {
  const steps: BuilderStep[] = ["basic", "curriculum"];

  if (format === "multi") {
    steps.push("certificate");
    if (certificate === "completion") steps.push("quiz");
  }

  steps.push("preview");
  return steps;
}

export function nextStep(
  step: BuilderStep,
  steps: BuilderStep[],
): BuilderStep | null {
  return steps[steps.indexOf(step) + 1] ?? null;
}

export function previousStep(
  step: BuilderStep,
  steps: BuilderStep[],
): BuilderStep | null {
  const index = steps.indexOf(step);
  return index > 0 ? steps[index - 1] : null;
}
