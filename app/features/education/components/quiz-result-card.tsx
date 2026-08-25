import { Link } from "react-router";
import { RotateCcw, Trophy } from "lucide-react";
import { cn } from "~/lib/utils";
import { CARD_SHADOW } from "~/features/education/lib/education-styles";
import type { QuizAttemptResult } from "~/features/education/types";

interface QuizResultCardProps {
  courseId: string;
  result: QuizAttemptResult;
  passMark: number;
  onRetake: () => void;
}

export function QuizResultCard({
  courseId,
  result,
  passMark,
  onRetake,
}: QuizResultCardProps) {
  const { passed, percent, correctCount, totalCount } = result;

  return (
    <div className="mx-auto max-w-[560px]">
      <div
        className={`rounded-2xl bg-white px-6 py-12 text-center sm:px-10 ${CARD_SHADOW}`}
      >
        <div
          className={cn(
            "mx-auto mb-5 flex size-18 items-center justify-center rounded-full",
            passed ? "bg-[#1FC16B]/15" : "bg-[#E17100]/15",
          )}
        >
          {passed ? (
            <Trophy className="size-8 text-[#1FC16B]" aria-hidden />
          ) : (
            <RotateCcw className="size-8 text-[#E17100]" aria-hidden />
          )}
        </div>

        <span
          className={cn(
            "mb-4 inline-block rounded-full px-4 py-1.5 text-[11px] font-bold tracking-[0.08em]",
            passed
              ? "bg-[#1FC16B]/15 text-[#1FC16B]"
              : "bg-[#E17100]/15 text-[#E17100]",
          )}
        >
          {passed ? "PASSED" : "NOT PASSED"}
        </span>

        <p className="mb-1 text-[34px] leading-none font-extrabold text-[#1A1A2E]">
          {percent}%
        </p>
        <p className="mb-5 text-sm text-[#9A9AB0]">
          {correctCount} of {totalCount} correct
        </p>

        <p className="mb-7.5 text-base leading-relaxed text-[#9A9AB0]">
          {passed
            ? "Well done — your certificate is ready to download."
            : `You need ${passMark}% to pass. Review the chapters and try again whenever you're ready.`}
        </p>

        <div className="flex flex-col items-stretch gap-2.5">
          {passed ? (
            <Link
              to={`/education/${courseId}/certificate`}
              className="cursor-pointer rounded-lg bg-[#1C5DD4] px-6.5 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-[#174FB4]"
            >
              View certificate
            </Link>
          ) : (
            <button
              type="button"
              onClick={onRetake}
              className="cursor-pointer rounded-lg bg-[#1C5DD4] px-6.5 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-[#174FB4]"
            >
              Retake quiz
            </button>
          )}

          <Link
            to={`/education/${courseId}/learn`}
            className="cursor-pointer px-6.5 py-3.5 text-[15px] font-semibold text-[#1C5DD4] hover:underline"
          >
            Back to course
          </Link>
        </div>
      </div>
    </div>
  );
}
