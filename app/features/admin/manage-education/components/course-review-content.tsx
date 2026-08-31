import {
  BookOpen,
  Check,
  FileText,
  Headphones,
  Info,
  ListChecks,
  Play,
} from "lucide-react";

import DetailPanel from "~/features/admin/components/detail-panel";
import {
  LESSON_TYPE_LABELS,
  type CourseReviewContent,
  type ReviewLesson,
} from "~/features/admin/manage-education/types";

const LESSON_ICON: Record<ReviewLesson["type"], typeof Play> = {
  YOUTUBE: Play,
  PDF: FileText,
  AUDIO: Headphones,
};

function formatDuration(seconds: number | null) {
  if (!seconds) return null;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

function LessonRow({ lesson }: { lesson: ReviewLesson }) {
  const Icon = LESSON_ICON[lesson.type];
  const duration = formatDuration(lesson.durationSeconds);
  const href = lesson.url ?? lesson.assetUrl;

  return (
    <li className="flex items-center gap-3 py-2">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <Icon size={13} />
      </span>

      <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800 dark:text-slate-100">
        {lesson.title}
      </span>

      {lesson.isPreview && (
        <span className="shrink-0 rounded-md bg-sky-50 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-sky-600 uppercase dark:bg-sky-500/10 dark:text-sky-400">
          Preview
        </span>
      )}

      <span className="shrink-0 text-[11px] font-medium text-slate-400 dark:text-slate-500">
        {LESSON_TYPE_LABELS[lesson.type]}
        {duration ? ` · ${duration}` : ""}
      </span>

      {href && (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 text-[11px] font-semibold text-sky-600 hover:underline dark:text-sky-400"
        >
          Open
        </a>
      )}
    </li>
  );
}

export default function CourseReviewContentPanels({
  review,
}: {
  review: CourseReviewContent;
}) {
  const { curriculum, quiz } = review;
  const hasCurriculum = Boolean(curriculum && curriculum.chapters.length > 0);
  const hasQuiz = Boolean(quiz && quiz.questions.length > 0);

  return (
    <>
      <DetailPanel
        title={
          hasCurriculum
            ? `Curriculum · ${curriculum!.chapters.length} section${
                curriculum!.chapters.length === 1 ? "" : "s"
              }, ${curriculum!.lessonCount} lesson${
                curriculum!.lessonCount === 1 ? "" : "s"
              }`
            : "Curriculum"
        }
      >
        {hasCurriculum ? (
          <div className="space-y-4">
            {curriculum!.chapters.map((chapter, index) => (
              <section key={chapter.id}>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-slate-100 text-[11px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {index + 1}
                  </span>
                  {chapter.title}
                </h3>

                {chapter.lessons.length > 0 ? (
                  <ul className="mt-1 divide-y divide-slate-100 pl-7 dark:divide-slate-800">
                    {chapter.lessons.map((lesson) => (
                      <LessonRow key={lesson.id} lesson={lesson} />
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 pl-7 text-xs text-slate-400 dark:text-slate-500">
                    This section has no lessons.
                  </p>
                )}
              </section>
            ))}
          </div>
        ) : (
          <p className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
            <BookOpen size={14} className="mt-0.5 shrink-0" />
            No curriculum was submitted with this course.
          </p>
        )}
      </DetailPanel>

      <DetailPanel
        title={
          hasQuiz
            ? `Quiz · ${quiz!.questions.length} question${
                quiz!.questions.length === 1 ? "" : "s"
              }, pass mark ${quiz!.passMark}%`
            : "Quiz"
        }
      >
        {hasQuiz ? (
          <ol className="space-y-4">
            {quiz!.questions.map((question, index) => (
              <li key={question.id}>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {index + 1}. {question.question}
                </p>
                <ul className="mt-1.5 space-y-1 pl-5">
                  {question.options.map((option) => (
                    <li
                      key={option.id}
                      className={
                        option.isCorrect
                          ? "flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400"
                          : "flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300"
                      }
                    >
                      {option.isCorrect ? (
                        <Check size={13} className="shrink-0" />
                      ) : (
                        <span className="size-[13px] shrink-0" />
                      )}
                      {option.label}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        ) : (
          <p className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
            <ListChecks size={14} className="mt-0.5 shrink-0" />
            No quiz was submitted with this course.
          </p>
        )}
      </DetailPanel>

      {!hasCurriculum && !hasQuiz && (
        <p className="flex items-start gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-xs leading-relaxed text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          <Info size={14} className="mt-px shrink-0" />
          If this course was submitted before curriculum support shipped, its
          creator needs to reopen the builder and save it again for the lessons
          and quiz to appear here.
        </p>
      )}
    </>
  );
}
