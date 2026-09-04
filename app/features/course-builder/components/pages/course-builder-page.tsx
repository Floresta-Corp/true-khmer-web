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
import {
  AddSectionModal,
  ConfirmRemoveSectionModal,
  EditSectionModal,
} from "../section-modals";
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
  | {
      ok: false;
      error: string;
      fieldErrors: Record<string, string[]>;
      courseId?: string;
    }
  | { ok: true; intent: "presign-cover" };

interface CourseBuilderPageProps {
  categories: CategoryOption[];
  initialDraft?: CourseDraft;
  initialSections?: BuilderSection[];
  courseStatus?: "DRAFT" | "PENDING" | "PUBLISHED" | "UNPUBLISHED";
  canReplaceCurriculum?: boolean;
  canReplaceQuiz?: boolean;
  initialCertificate?: CertificateKind;
  initialFormat?: CourseFormat;
  initialPassMark?: string;
  initialQuestions?: QuizQuestion[];
  initialCourseId?: string | null;
  initialStep?: BuilderStep;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isSavedId(id: string) {
  return UUID_PATTERN.test(id);
}

export default function CourseBuilderPage({
  categories,
  initialDraft,
  initialSections,
  courseStatus,
  canReplaceCurriculum = true,
  canReplaceQuiz = true,
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
  const [courseId, setCourseId] = useState<string | null>(initialCourseId);

  const [sections, setSections] = useState<BuilderSection[]>(
    () => initialSections ?? [],
  );
  const [lessonUploading, setLessonUploading] = useState(false);
  const [format, setFormat] = useState<CourseFormat>(initialFormat ?? "multi");
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set((initialSections ?? []).map((section) => section.id)),
  );
  const added = useRef(0);

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

  const singleIds = useRef({
    sectionId: savedSingle?.id,
    lessonId: savedSingleLesson?.id,
  });
  const patchLesson = (changes: Partial<LessonDraft>) =>
    setLesson((current) => ({ ...current, ...changes }));

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

  const [addingSection, setAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [discardingSection, setDiscardingSection] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editSectionTitle, setEditSectionTitle] = useState("");
  const [removingSectionId, setRemovingSectionId] = useState<string | null>(
    null,
  );

  const openAddSection = () => {
    setNewSectionTitle("");
    setDiscardingSection(false);
    setAddingSection(true);
  };

  const closeAddSection = () => {
    setAddingSection(false);
    setDiscardingSection(false);
  };

  const confirmAddSection = () => {
    const title = newSectionTitle.trim();
    if (!title) return;
    added.current += 1;
    const id = `new-section-${added.current}`;
    setSections((current) => [...current, { id, title, lessons: [] }]);
    setOpenSections((current) => new Set(current).add(id));
    closeAddSection();
  };

  const openEditSection = (sectionId: string) => {
    const section = sections.find((item) => item.id === sectionId);
    if (!section) return;
    setEditSectionTitle(section.title);
    setEditingSectionId(sectionId);
  };

  const saveSectionTitle = () => {
    const title = editSectionTitle.trim();
    if (title && editingSectionId) {
      setSections((current) =>
        current.map((section) =>
          section.id === editingSectionId ? { ...section, title } : section,
        ),
      );
    }
    setEditingSectionId(null);
  };

  const removeSection = () => {
    if (removingSectionId) {
      setSections((current) =>
        current.filter((section) => section.id !== removingSectionId),
      );
    }
    setRemovingSectionId(null);
  };

  const removingSection = sections.find(
    (section) => section.id === removingSectionId,
  );

  const moveSection = (draggedId: string, targetId: string) => {
    if (draggedId === targetId) return;
    setSections((current) => {
      const from = current.findIndex((section) => section.id === draggedId);
      const to = current.findIndex((section) => section.id === targetId);
      if (from < 0 || to < 0) return current;
      const next = [...current];
      next.splice(to, 0, next.splice(from, 1)[0]);
      return next;
    });
  };

  const moveLesson = (
    fromSectionId: string,
    lessonId: string,
    toSectionId: string,
    targetLessonId: string | null,
  ) => {
    if (fromSectionId === toSectionId && lessonId === targetLessonId) return;

    setSections((current) => {
      const lesson = current
        .find((section) => section.id === fromSectionId)
        ?.lessons.find((item) => item.id === lessonId);
      if (!lesson) return current;

      if (fromSectionId === toSectionId) {
        return current.map((section) => {
          if (section.id !== fromSectionId) return section;
          const lessons = [...section.lessons];
          const from = lessons.findIndex((item) => item.id === lessonId);
          const to = targetLessonId
            ? lessons.findIndex((item) => item.id === targetLessonId)
            : lessons.length - 1;
          if (from < 0 || to < 0 || from === to) return section;
          lessons.splice(to, 0, lessons.splice(from, 1)[0]);
          return { ...section, lessons };
        });
      }

      return current.map((section) => {
        if (section.id === fromSectionId) {
          return {
            ...section,
            lessons: section.lessons.filter((item) => item.id !== lessonId),
          };
        }
        if (section.id === toSectionId) {
          const lessons = [...section.lessons];
          const at = targetLessonId
            ? lessons.findIndex((item) => item.id === targetLessonId)
            : -1;
          lessons.splice(at < 0 ? lessons.length : at, 0, lesson);
          return { ...section, lessons };
        }
        return section;
      });
    });

    if (fromSectionId !== toSectionId) {
      setOpenSections((current) => new Set(current).add(toSectionId));
    }
  };

  const openAddLesson = (sectionId: string) => {
    setLessonDraft(emptyLessonDraft());
    setLessonUploading(false);
    setLessonTarget(sectionId);
  };

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

  const effectiveSections = useMemo<BuilderSection[]>(() => {
    if (format !== "single") return sections;

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

  const steps = visibleSteps(format, certificate);

  const current = steps.includes(step) ? step : steps[steps.length - 1];

  const definition = STEP_DEFINITIONS[current];
  const back = previousStep(current, steps);
  const forward = nextStep(current, steps);
  const busy = fetcher.state !== "idle";

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

    const chapters = effectiveSections.map((section) => ({
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

    const nothingToOverwrite = !courseId;
    const sendCurriculum = nothingToOverwrite || canReplaceCurriculum;
    const sendQuiz = nothingToOverwrite || canReplaceQuiz;

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
          outcomes: draft.outcomes
            .map((outcome) => outcome.trim())
            .filter(Boolean),
          tags: draft.tags,
          certificateKind: steps.includes("certificate")
            ? CERTIFICATE_API_VALUE[certificate]
            : null,
        }),
      },
      { method: "post" },
    );
  };

  const savedCourseId =
    result?.ok === false
      ? result.courseId
      : result?.ok && "course" in result
        ? result.course.id
        : undefined;

  if (savedCourseId && savedCourseId !== courseId) {
    setCourseId(savedCourseId);
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

            {courseId && (!canReplaceCurriculum || !canReplaceQuiz) && (
              <p className="mb-5 rounded-lg border border-[#F59E0B]/30 bg-[#F59E0B]/5 px-4 py-3 text-[13px] font-semibold text-[#B45309]">
                {`This course's saved ${
                  !canReplaceCurriculum && !canReplaceQuiz
                    ? "curriculum and quiz"
                    : !canReplaceCurriculum
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
                onAddSection={openAddSection}
                onEditSection={openEditSection}
                onMoveSection={moveSection}
                onMoveLesson={moveLesson}
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

      {addingSection && (
        <AddSectionModal
          title={newSectionTitle}
          onTitleChange={setNewSectionTitle}
          onConfirm={confirmAddSection}
          onClose={closeAddSection}
          discarding={discardingSection}
          onRequestDiscard={() =>
            newSectionTitle.trim()
              ? setDiscardingSection(true)
              : closeAddSection()
          }
          onCancelDiscard={() => setDiscardingSection(false)}
        />
      )}

      {editingSectionId && (
        <EditSectionModal
          title={editSectionTitle}
          onTitleChange={setEditSectionTitle}
          onSave={saveSectionTitle}
          onDelete={() => {
            setRemovingSectionId(editingSectionId);
            setEditingSectionId(null);
          }}
          onClose={() => setEditingSectionId(null)}
        />
      )}

      {removingSection && (
        <ConfirmRemoveSectionModal
          lessonCount={removingSection.lessons.length}
          onConfirm={removeSection}
          onClose={() => setRemovingSectionId(null)}
        />
      )}

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
