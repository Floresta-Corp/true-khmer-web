import { useCallback, useRef, useState } from "react";
import { useFetcher, useNavigate } from "react-router";
import { BuilderFooter } from "../builder-footer";
import { BuilderRail } from "../builder-rail";
import { BasicStep } from "../steps/basic-step";
import { CertificateStep } from "../steps/certificate-step";
import { CurriculumStep } from "../steps/curriculum-step";
import { PreviewStep } from "../steps/preview-step";
import { QuizStep } from "../steps/quiz-step";
import { QuizQuestionModal } from "../quiz-question-modal";
import { useQuizDraft } from "../../lib/use-quiz-draft";
import {
  STEP_DEFINITIONS,
  nextStep,
  previousStep,
} from "../../lib/builder-steps";
import {
  emptyDraft,
  type BuilderStep,
  type CategoryOption,
  type CourseDraft,
  type CertificateKind,
  type CourseFormat,
} from "../../types";
import type { CourseSection } from "~/features/education/types";

type SaveResult =
  | {
      ok: true;
      intent: "save-draft" | "submit";
      course: { id: string };
    }
  | { ok: false; error: string; fieldErrors: Record<string, string[]> }
  | { ok: true; intent: "presign-cover" };

interface CourseBuilderPageProps {
  categories: CategoryOption[];
  /** Prefilled when editing an existing course, empty when creating one. */
  initialDraft?: CourseDraft;
  /** The course's existing chapters, shown on the Curriculum step. */
  initialSections?: CourseSection[];
  /** Set when editing, so saves patch the course instead of creating one. */
  initialCourseId?: string | null;
  /** Step to open on, so the teach screen can deep-link into the builder. */
  initialStep?: BuilderStep;
}

export default function CourseBuilderPage({
  categories,
  initialDraft,
  initialSections,
  initialCourseId = null,
  initialStep = "basic",
}: CourseBuilderPageProps) {
  const fetcher = useFetcher<SaveResult>();
  const navigate = useNavigate();

  const [step, setStep] = useState<BuilderStep>(initialStep);
  const [draft, setDraft] = useState<CourseDraft>(
    () => initialDraft ?? emptyDraft(),
  );
  /** Set once a draft has been created, so later saves patch it. */
  const [courseId, setCourseId] = useState<string | null>(initialCourseId);

  // Curriculum state. The API has no curriculum resource, so this is local to
  // the session — it prefills from the course but is not saved back.
  const [sections, setSections] = useState<CourseSection[]>(
    () => initialSections ?? [],
  );
  const [format, setFormat] = useState<CourseFormat>("multi");
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set((initialSections ?? []).map((section) => section.id)),
  );
  /** Counter for locally-added ids; a ref so rapid adds cannot collide. */
  const added = useRef(0);

  const quiz = useQuizDraft();
  const [certificate, setCertificate] = useState<CertificateKind>("completion");

  const toggleSection = (id: string) =>
    setOpenSections((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const addSection = () => {
    added.current += 1;
    const id = `new-section-${added.current}`;
    setSections((current) => [
      ...current,
      { id, title: `Section ${current.length + 1}`, lessons: [] },
    ]);
    setOpenSections((current) => new Set(current).add(id));
  };

  const addLesson = (sectionId: string) => {
    added.current += 1;
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lessons: [
                ...section.lessons,
                {
                  id: `${sectionId}-new-${added.current}`,
                  title: `Lesson ${section.lessons.length + 1}`,
                  type: "video" as const,
                  duration: "",
                  isPreview: false,
                  isComplete: false,
                },
              ],
            }
          : section,
      ),
    );
  };

  const definition = STEP_DEFINITIONS[step];
  const back = previousStep(step);
  const forward = nextStep(step);
  const busy = fetcher.state !== "idle";

  const result = fetcher.data;
  const fieldErrors =
    result && result.ok === false ? result.fieldErrors : ({} as never);
  const formError = result && result.ok === false ? result.error : null;

  const patch = useCallback((changes: Partial<CourseDraft>) => {
    setDraft((current) => ({ ...current, ...changes }));
  }, []);

  const save = (intent: "save-draft" | "submit") => {
    fetcher.submit(
      {
        intent,
        title: draft.title,
        description: draft.description,
        categoryId: draft.categoryId,
        ...(draft.coverImageKey ? { coverImageKey: draft.coverImageKey } : {}),
        ...(courseId ? { courseId } : {}),
      },
      { method: "post" },
    );
  };

  // Remember the created course so a second save patches rather than duplicates.
  if (
    result?.ok &&
    "course" in result &&
    result.course.id &&
    result.course.id !== courseId
  ) {
    setCourseId(result.course.id);
  }

  return (
    <div className="flex min-h-screen bg-white">
      <BuilderRail current={step} onStepSelect={setStep} />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto px-6 pt-9 pb-10">
          <div className="mx-auto max-w-[1100px]">
            <h2 className="mb-1.5 text-[26px] font-extrabold text-[#1A1A2E]">
              {definition.heading}
            </h2>
            <p className="mb-7 text-sm text-[#9A9AB0]">
              {definition.subheading}
            </p>

            {formError && (
              <p className="mb-5 rounded-lg border border-[#FB3748]/30 bg-[#FB3748]/5 px-4 py-3 text-[13px] font-semibold text-[#FB3748]">
                {formError}
              </p>
            )}

            {step === "basic" ? (
              <BasicStep
                draft={draft}
                categories={categories}
                fieldErrors={fieldErrors}
                onChange={patch}
              />
            ) : step === "curriculum" ? (
              <CurriculumStep
                format={format}
                sections={sections}
                openSections={openSections}
                onFormatChange={setFormat}
                onToggleSection={toggleSection}
                onAddSection={addSection}
                onAddLesson={addLesson}
              />
            ) : step === "quiz" ? (
              <QuizStep quiz={quiz} />
            ) : step === "certificate" ? (
              <CertificateStep value={certificate} onChange={setCertificate} />
            ) : (
              <PreviewStep
                draft={draft}
                categories={categories}
                sections={sections}
                questionCount={quiz.questions.length}
                passMark={quiz.passMark}
                onEditStep={setStep}
              />
            )}
          </div>
        </div>

        <BuilderFooter
          backLabel={back ? `Back to ${STEP_DEFINITIONS[back].label}` : null}
          continueLabel={
            forward ? `Continue to ${STEP_DEFINITIONS[forward].label}` : null
          }
          showSubmit={step === "preview"}
          busy={busy}
          onBack={() => back && setStep(back)}
          onContinue={() => forward && setStep(forward)}
          onSaveDraft={() => save("save-draft")}
          onSubmit={() => {
            save("submit");
            navigate("/course-listing");
          }}
        />
      </div>

      <QuizQuestionModal quiz={quiz} />
    </div>
  );
}
