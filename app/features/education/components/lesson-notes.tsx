import { Link } from "react-router";
import { Award, Check } from "lucide-react";
import { cn } from "~/lib/utils";
import { CARD } from "~/features/education/lib/education-styles";
import type { ActiveLesson } from "~/features/education/types";

interface LessonNotesProps {
  lesson: ActiveLesson;
  courseId: string;
  isComplete: boolean;
  onToggleComplete: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  showQuizButton: boolean;
  showCertificateButton: boolean;
}

export function LessonNotes({
  lesson,
  courseId,
  isComplete,
  onToggleComplete,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  showQuizButton,
  showCertificateButton,
}: LessonNotesProps) {
  return (
    <div className={`${CARD} mt-5 px-6 pt-5.5 pb-7.5 sm:px-7`}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-5.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            aria-pressed={isComplete}
            onClick={onToggleComplete}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-full px-5.5 py-2.75 text-sm font-bold transition-colors",
              isComplete
                ? "bg-[#1FC16B]/15 text-[#1FC16B]"
                : "border border-gray-200 bg-white text-[#333333] hover:border-[#1C5DD4] hover:text-[#1C5DD4]",
            )}
          >
            {isComplete && <Check className="size-4" aria-hidden />}
            {isComplete ? "Completed" : "Mark as complete"}
          </button>

          {showQuizButton && (
            <Link
              to={`/education/${courseId}/quiz`}
              className="cursor-pointer rounded-full bg-[#1C5DD4] px-5.5 py-2.75 text-sm font-bold text-white transition-colors hover:bg-[#174FB4]"
            >
              Take the quiz
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            disabled={!hasPrevious}
            onClick={onPrevious}
            className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#333333] transition-colors hover:border-[#1C5DD4] hover:text-[#1C5DD4] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-[#333333]"
          >
            ‹ Previous
          </button>
          <button
            type="button"
            disabled={!hasNext}
            onClick={onNext}
            className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#333333] transition-colors hover:border-[#1C5DD4] hover:text-[#1C5DD4] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-[#333333]"
          >
            Next ›
          </button>
        </div>
      </div>

      <h2 className="mb-3 text-lg font-bold text-[#1A1A2E]">
        About this chapter
      </h2>
      <p className="mb-7 text-base leading-[1.7] text-pretty text-[#333333]">
        {lesson.description}
      </p>

      <h2 className="mb-3.5 text-lg font-bold text-[#1A1A2E]">
        What you&apos;ll learn
      </h2>
      <ul className="flex flex-col gap-3">
        {lesson.outcomes.map((outcome) => (
          <li
            key={outcome}
            className="flex gap-3 text-base leading-relaxed text-[#333333]"
          >
            <span className="shrink-0 text-[#9A9AB0]" aria-hidden>
              •
            </span>
            <span>{outcome}</span>
          </li>
        ))}
      </ul>

      {showCertificateButton && (
        <Link
          to={`/education/${courseId}/certificate`}
          className="mt-7 flex w-full cursor-pointer items-center justify-center gap-2.25 rounded-[10px] bg-[#1C5DD4] px-5.5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#174FB4]"
        >
          <Award className="size-4.25" aria-hidden />
          View my certificate
        </Link>
      )}
    </div>
  );
}
