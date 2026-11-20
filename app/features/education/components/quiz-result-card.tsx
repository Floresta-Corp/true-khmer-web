import { Link } from "react-router";
import { CircleCheck, CircleX, RotateCcw, Trophy } from "lucide-react";
import { cn } from "~/lib/utils";
import { CARD_SHADOW } from "~/features/education/lib/education-styles";
import type {
  PublicQuizQuestion,
  QuizAttemptResult,
} from "~/features/education/types";

interface QuizResultCardProps {
  courseId: string;
  result: QuizAttemptResult;
  questions: PublicQuizQuestion[];
  passMark: number;
  onRetake: () => void;
}

export function QuizResultCard({
  courseId,
  result,
  questions,
  passMark,
  onRetake,
}: QuizResultCardProps) {
  const { passed, percent, correctCount, totalCount } = result;

  const promptById = new Map(
    questions.map((question) => [question.id, question.question]),
  );
  const review = result.questions.flatMap((graded, index) => {
    const prompt = promptById.get(graded.questionId);
    return prompt ? [{ ...graded, number: index + 1, prompt }] : [];
  });

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
            <>
              <Link
                to={`/education/${courseId}/complete`}
                className="cursor-pointer rounded-lg bg-[#1C5DD4] px-6.5 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-[#174FB4]"
              >
                Finish class
              </Link>
              <Link
                to={`/education/${courseId}/certificate`}
                className="cursor-pointer px-6.5 py-3.5 text-[15px] font-semibold text-[#1C5DD4] hover:underline"
              >
                View certificate
              </Link>
            </>
          ) : (
            <button
              type="button"
              onClick={onRetake}
              className="cursor-pointer rounded-lg bg-[#1C5DD4] px-6.5 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-[#174FB4]"
            >
              Retake quiz
            </button>
          )}

          {!passed && (
            <Link
              to={`/education/${courseId}/learn`}
              className="cursor-pointer px-6.5 py-3.5 text-[15px] font-semibold text-[#1C5DD4] hover:underline"
            >
              Back to course
            </Link>
          )}
        </div>
      </div>

      {review.length > 0 && (
        <section
          aria-labelledby="quiz-review-heading"
          className={`mt-5 rounded-2xl bg-white px-6 py-7 sm:px-10 ${CARD_SHADOW}`}
        >
          <h2
            id="quiz-review-heading"
            className="mb-4 text-base font-bold text-[#1A1A2E]"
          >
            Your answers
          </h2>

          <ol className="flex flex-col divide-y divide-[#EEEEF2]">
            {review.map((item) => (
              <li
                key={item.questionId}
                className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0"
              >
                {item.correct ? (
                  <CircleCheck
                    className="mt-0.5 size-5 shrink-0 text-[#1FC16B]"
                    aria-hidden
                  />
                ) : (
                  <CircleX
                    className="mt-0.5 size-5 shrink-0 text-[#FB3748]"
                    aria-hidden
                  />
                )}
                <p className="min-w-0 flex-1 text-sm leading-relaxed text-[#333333]">
                  <span className="font-semibold text-[#1A1A2E]">
                    {item.number}.
                  </span>{" "}
                  {item.prompt}
                </p>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold",
                    item.correct
                      ? "bg-[#1FC16B]/15 text-[#1FC16B]"
                      : "bg-[#FB3748]/10 text-[#FB3748]",
                  )}
                >
                  {item.correct ? "Correct" : "Incorrect"}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
