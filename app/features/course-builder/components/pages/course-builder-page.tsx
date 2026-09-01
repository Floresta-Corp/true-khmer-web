import { useCallback, useMemo, useRef, useState } from "react";
import { useFetcher, useNavigate } from "react-router";
import { BuilderFooter } from "../builder-footer";
import { BuilderRail } from "../builder-rail";
import { BasicStep } from "../steps/basic-step";
import { CertificateStep } from "../steps/certificate-step";
import { CurriculumStep } from "../steps/curriculum-step";
import { PreviewStep } from "../steps/preview-step";
import { QuizStep } from "../steps/quiz-step";
import { QuizQuestionModal } from "../quiz-question-modal";
import { AddLessonModal } from "../add-lesson-modal";
import { useQuizDraft } from "../../lib/use-quiz-draft";
import {
  STEP_DEFINITIONS,
  nextStep,
  previousStep,
  visibleSteps,
} from "../../lib/builder-steps";
import {
  emptyDraft,
  type BuilderStep,
  type CategoryOption,
  type CourseDraft,
  emptyLessonDraft,
  type CertificateKind,
  type CourseFormat,
  type QuizQuestion,
  type LessonDraft,
} from "../../types";
import type { CourseSection } from "~/features/education/types";
import {
  CERTIFICATE_API_VALUE,
  DIFFICULTY_API_VALUE,
  lessonApiType,
  type BuilderSection,
} from "~/features/course-builder/types";

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
  initialSections?: BuilderSection[];
  /** The saved course's status; a course under review or live cannot be edited. */
  courseStatus?: "DRAFT" | "PENDING" | "PUBLISHED" | "UNPUBLISHED";
  /** False when the saved curriculum could not be read back. */
  curriculumLoaded?: boolean;
  quizLoaded?: boolean;
  initialCertificate?: CertificateKind;
  initialFormat?: CourseFormat;
  initialPassMark?: string;
  initialQuestions?: QuizQuestion[];
  /** Set when editing, so saves patch the course instead of creating one. */
  initialCourseId?: string | null;
  /** Step to open on, so the teach screen can deep-link into the builder. */
  initialStep?: BuilderStep;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** True for an id the API issued, false for one this session invented. */
function isSavedId(id: string) {
  return UUID_PATTERN.test(id);
}

export default function CourseBuilderPage({
  categories,
  initialDraft,
  initialSections,
  courseStatus,
  curriculumLoaded = true,
  quizLoaded = true,
  initialCertificate,
  initialFormat,
  initialPassMark,
  initialQuestions,
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

  // Curriculum state, prefilled from the saved course. Each lesson keeps its
  // url/assetKey: dropping them would make the next save treat every loaded
  // lesson as sourceless and discard it.
  const [sections, setSections] = useState<BuilderSection[]>(
    () => initialSections ?? [],
  );
  const [lessonUploading, setLessonUploading] = useState(false);
  const [format, setFormat] = useState<CourseFormat>(initialFormat ?? "multi");
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set((initialSections ?? []).map((section) => section.id)),
  );
  /** Counter for locally-added ids; a ref so rapid adds cannot collide. */
  const added = useRef(0);

  /**
   * The single-lesson course's own content, held apart from `sections` because
   * that format has no sections in the design. Seeded from the saved lesson so
   * editing one does not start blank.
   */
  const savedSingle =
    initialFormat === "single" ? (initialSections?.[0] ?? null) : null;
  const savedSingleLesson = savedSingle?.lessons[0] ?? null;

  const [lesson, setLesson] = useState<LessonDraft>(() =>
    savedSingleLesson
      ? {
          title: savedSingleLesson.title,
          source:
            savedSingleLesson.type === "pdf"
              ? "pdf"
              : savedSingleLesson.type === "audio"
                ? "audio"
                : "youtube",
          url: savedSingleLesson.url ?? "",
          fileName: savedSingleLesson.assetKey
            ? (savedSingleLesson.assetKey.split("/").pop() ?? null)
            : null,
          assetKey: savedSingleLesson.assetKey ?? null,
        }
      : emptyLessonDraft(),
  );

  /** Ids of the saved single lesson, so a re-save updates rather than replaces. */
  const singleIds = useRef({
    sectionId: savedSingle?.id,
    lessonId: savedSingleLesson?.id,
  });
  const patchLesson = (changes: Partial<LessonDraft>) =>
    setLesson((current) => ({ ...current, ...changes }));

  /** Which section the "Add lesson" dialog is adding to, and its draft. */
  const [lessonTarget, setLessonTarget] = useState<string | null>(null);
  const [lessonDraft, setLessonDraft] = useState<LessonDraft>(emptyLessonDraft);

  const quiz = useQuizDraft({
    passMark: initialPassMark,
    questions: initialQuestions,
  });
  const [certificate, setCertificate] = useState<CertificateKind>(
    initialCertificate ?? "completion",
  );

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

  const openAddLesson = (sectionId: string) => {
    setLessonDraft(emptyLessonDraft());
    setLessonUploading(false);
    setLessonTarget(sectionId);
  };

  /** The design collects a lesson in a dialog, then appends it. */
  const confirmAddLesson = () => {
    if (!lessonTarget) return;
    added.current += 1;

    setSections((current) =>
      current.map((section) =>
        section.id === lessonTarget
          ? {
              ...section,
              lessons: [
                ...section.lessons,
                {
                  id: `${lessonTarget}-new-${added.current}`,
                  title: lessonDraft.title.trim(),
                  type:
                    lessonDraft.source === "youtube"
                      ? ("video" as const)
                      : lessonDraft.source,
                  duration: "",
                  isPreview: false,
                  isComplete: false,
                  // Kept so the lesson can actually be saved — the read model
                  // these rows share has nowhere to put a source.
                  url:
                    lessonDraft.source === "youtube"
                      ? lessonDraft.url.trim()
                      : null,
                  assetKey:
                    lessonDraft.source === "youtube"
                      ? null
                      : lessonDraft.assetKey,
                },
              ],
            }
          : section,
      ),
    );

    setLessonTarget(null);
  };

  /**
   * What the course's curriculum actually is, whichever format is in use. A
   * single-lesson course keeps its content in `lesson`, so it is folded into
   * one section here — otherwise Preview would count nothing and a save would
   * send an empty curriculum.
   */
  const effectiveSections = useMemo<BuilderSection[]>(() => {
    if (format !== "single") return sections;

    // Only a source is required. The single-lesson step collects a format and a
    // URL or file but no lesson title — the course itself is the lesson — so
    // the title falls back to the course's own.
    const hasSource = Boolean(lesson.url.trim() || lesson.assetKey);
    if (!hasSource) return [];

    const title = lesson.title.trim() || draft.title.trim() || "Course content";

    return [
      {
        id: singleIds.current.sectionId ?? "single-section",
        title,
        lessons: [
          {
            id: singleIds.current.lessonId ?? "single-lesson",
            title,
            type:
              lesson.source === "youtube" ? ("video" as const) : lesson.source,
            duration: "",
            isPreview: false,
            isComplete: false,
            url: lesson.source === "youtube" ? lesson.url.trim() : null,
            assetKey: lesson.source === "youtube" ? null : lesson.assetKey,
          },
        ],
      },
    ];
  }, [format, sections, lesson, draft.title]);

  // Which steps exist depends on the course: a single-lesson course has no
  // Certificate step, and Quiz only appears for a certificate of completion.
  const steps = visibleSteps(format, certificate);

  // Changing either can remove the step being viewed — switching the
  // certificate to participation while on Quiz, say — so fall back to the last
  // step that still exists rather than rendering nothing.
  const current = steps.includes(step) ? step : steps[steps.length - 1];

  const definition = STEP_DEFINITIONS[current];
  const back = previousStep(current, steps);
  const forward = nextStep(current, steps);
  const busy = fetcher.state !== "idle";

  /**
   * The API refuses every write while a course is under review or live, so the
   * builder says so up front rather than letting the creator fill in a form
   * whose save can only fail.
   */
  const lockedReason =
    courseStatus === "PENDING"
      ? "This course is under review, so it cannot be edited. Withdraw the submission from Course Listing to make changes."
      : courseStatus === "PUBLISHED"
        ? "This course is live, so it cannot be edited. Unpublish it from Course Listing to make changes."
        : null;
  const isLocked = Boolean(lockedReason);

  const result = fetcher.data;
  const fieldErrors =
    result && result.ok === false ? result.fieldErrors : ({} as never);
  const formError = result && result.ok === false ? result.error : null;

  const patch = useCallback((changes: Partial<CourseDraft>) => {
    setDraft((current) => ({ ...current, ...changes }));
  }, []);

  const save = (intent: "save-draft" | "submit") => {
    if (isLocked) return;

    // A lesson with no source was never uploaded, and the API rejects it, so
    // it is dropped rather than failing the whole save.
    const chapters = effectiveSections.map((section) => ({
      // Rows added in this session carry a synthetic id like `new-section-2`,
      // which the API must treat as an insert — only real ids are sent back.
      ...(isSavedId(section.id) ? { id: section.id } : {}),
      title: section.title.trim() || "Untitled section",
      lessons: section.lessons
        .filter((lesson) => lesson.url || lesson.assetKey)
        .map((lesson) => ({
          ...(isSavedId(lesson.id) ? { id: lesson.id } : {}),
          title: lesson.title.trim(),
          type: lessonApiType(lesson),
          url: lesson.url,
          assetKey: lesson.assetKey,
          isPreview: lesson.isPreview,
        })),
    }));

    // Only fully-written questions can be saved; a blank row the creator has
    // not filled in yet would fail validation.
    const questions = quiz.questions
      .filter(
        (question) =>
          question.text.trim().length > 0 &&
          question.answers.filter((answer) => answer.text.trim()).length >= 2 &&
          question.answers.some(
            (answer) => answer.correct && answer.text.trim(),
          ),
      )
      .map((question) => ({
        question: question.text.trim(),
        options: question.answers
          .filter((answer) => answer.text.trim())
          .map((answer) => ({
            label: answer.text.trim(),
            isCorrect: answer.correct,
          })),
      }));

    // A save replaces the curriculum and quiz wholesale. On an existing course
    // whose saved content failed to load, the builder is showing an empty
    // structure it never read — sending that would erase the real one, so the
    // field is omitted and the API leaves it untouched.
    const nothingToOverwrite = !courseId;
    const sendCurriculum = nothingToOverwrite || curriculumLoaded;
    const sendQuiz = nothingToOverwrite || quizLoaded;

    fetcher.submit(
      {
        intent,
        title: draft.title,
        description: draft.description,
        categoryId: draft.categoryId,
        ...(draft.coverImageKey ? { coverImageKey: draft.coverImageKey } : {}),
        ...(courseId ? { courseId } : {}),
        ...(sendCurriculum
          ? {
              curriculum: JSON.stringify({
                format: format === "single" ? "SINGLE" : "MULTI",
                chapters,
              }),
            }
          : {}),
        ...(sendQuiz
          ? {
              quiz: JSON.stringify({
                passMark: Number(quiz.passMark) || 70,
                questions,
              }),
            }
          : {}),
        meta: JSON.stringify({
          difficulty: draft.difficulty
            ? DIFFICULTY_API_VALUE[draft.difficulty]
            : null,
          skills: draft.skills,
          tags: draft.tags,
          certificateKind: steps.includes("certificate")
            ? CERTIFICATE_API_VALUE[certificate]
            : null,
        }),
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
      <BuilderRail
        steps={steps}
        current={current}
        title={initialCourseId ? "Edit Course" : "Create New Course"}
        onStepSelect={setStep}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto px-6 pt-9 pb-10">
          <div className="mx-auto max-w-275">
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

            {lockedReason && (
              <p className="mb-5 rounded-lg border border-[#F59E0B]/40 bg-[#F59E0B]/10 px-4 py-3 text-[13px] font-semibold text-[#B45309]">
                {lockedReason}
              </p>
            )}

            {courseId && (!curriculumLoaded || !quizLoaded) && (
              <p className="mb-5 rounded-lg border border-[#F59E0B]/30 bg-[#F59E0B]/5 px-4 py-3 text-[13px] font-semibold text-[#B45309]">
                {`This course's saved ${
                  !curriculumLoaded && !quizLoaded
                    ? "curriculum and quiz"
                    : !curriculumLoaded
                      ? "curriculum"
                      : "quiz"
                } could not be loaded, so what you see here is empty. Saving will leave the saved version untouched — reload before editing it.`}
              </p>
            )}

            {current === "basic" ? (
              <BasicStep
                draft={draft}
                categories={categories}
                fieldErrors={fieldErrors}
                onChange={patch}
              />
            ) : current === "curriculum" ? (
              <CurriculumStep
                format={format}
                lesson={lesson}
                onLessonChange={patchLesson}
                sections={sections}
                openSections={openSections}
                onFormatChange={setFormat}
                onToggleSection={toggleSection}
                onAddSection={addSection}
                onAddLesson={openAddLesson}
              />
            ) : current === "quiz" ? (
              <QuizStep quiz={quiz} />
            ) : current === "certificate" ? (
              <CertificateStep value={certificate} onChange={setCertificate} />
            ) : (
              <PreviewStep
                draft={draft}
                categories={categories}
                sections={effectiveSections}
                questionCount={quiz.questions.length}
                passMark={quiz.passMark}
                format={format}
                hasQuizStep={steps.includes("quiz")}
                onEditStep={setStep}
              />
            )}
          </div>
        </div>

        <BuilderFooter
          backLabel={back ? "Back" : null}
          continueLabel={forward ? "Continue" : null}
          showSubmit={current === "preview"}
          busy={busy || isLocked}
          onBack={() => back && setStep(back)}
          onContinue={() => forward && setStep(forward)}
          onSaveDraft={() => save("save-draft")}
          onSubmit={() => {
            if (isLocked) return;
            save("submit");
            navigate("/course-listing");
          }}
        />
      </div>

      <QuizQuestionModal quiz={quiz} />

      {lessonTarget && (
        <AddLessonModal
          draft={lessonDraft}
          onChange={(changes) =>
            setLessonDraft((current) => ({ ...current, ...changes }))
          }
          onConfirm={confirmAddLesson}
          onClose={() => setLessonTarget(null)}
          uploading={lessonUploading}
          onUploadingChange={setLessonUploading}
        />
      )}
    </div>
  );
}
