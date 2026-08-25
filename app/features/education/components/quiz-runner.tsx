import { useState } from "react";
import { Link, useSubmit, useNavigation } from "react-router";
import { ChevronLeft } from "lucide-react";
import { cn } from "~/lib/utils";
import { CARD } from "~/features/education/lib/education-styles";
import type { PublicCourseQuiz } from "~/features/education/types";

interface QuizRunnerProps {
  courseId: string;
  quiz: PublicCourseQuiz;
}

export function QuizRunner({ courseId, quiz }: QuizRunnerProps) {
  const submit = useSubmit();
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const question = quiz.questions[currentIndex];
  const isLast = currentIndex === quiz.questions.length - 1;
  const selectedOptionId = answers[question.id];
  const isSubmitting = navigation.state !== "idle";

  const handleNext = () => {
    if (!isLast) {
      setCurrentIndex((index) => index + 1);
      return;
    }

    const formData = new FormData();
    for (const [questionId, optionId] of Object.entries(answers)) {
      formData.append(`answer:${questionId}`, optionId);
    }
    submit(formData, { method: "post" });
  };

  const progressPercent = Math.round(
    ((currentIndex + 1) / quiz.questions.length) * 100,
  );

  return (
    <div className="mx-auto max-w-[720px]">
      <Link
        to={`/education/${courseId}/learn`}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1C5DD4] hover:underline"
      >
        <ChevronLeft className="size-4" aria-hidden />
        Back to course
      </Link>

      <div className={`${CARD} px-6 pt-8.5 pb-10 sm:px-9`}>
        <div className="mb-3 flex items-center justify-between gap-4">
          <span className="text-sm font-bold text-[#1C5DD4]">
            Question {currentIndex + 1} of {quiz.questions.length}
          </span>
          <span className="text-xs text-[#9A9AB0]">
            {quiz.passMark}% to pass
          </span>
        </div>

        <div
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Quiz progress"
          className="mb-6.5 h-1.5 overflow-hidden rounded-full bg-[#E8E8E8]"
        >
          <div
            className="h-full rounded-full bg-[#1C5DD4] transition-[width]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <fieldset>
          <legend className="mb-5.5 text-2xl leading-snug font-bold text-[#1A1A2E]">
            {question.question}
          </legend>

          <div className="mb-7 flex flex-col gap-3">
            {question.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              return (
                <label
                  key={option.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-[10px] border px-4.5 py-3.5 text-sm transition-colors",
                    isSelected
                      ? "border-[#1C5DD4] bg-[#D5E2FA]/40 font-semibold text-[#1C5DD4]"
                      : "border-gray-200 bg-white text-[#333333] hover:border-[#1C5DD4]",
                  )}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option.id}
                    checked={isSelected}
                    onChange={() =>
                      setAnswers((current) => ({
                        ...current,
                        [question.id]: option.id,
                      }))
                    }
                    className="size-4 shrink-0 accent-[#1C5DD4]"
                  />
                  {option.label}
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="flex items-center justify-between gap-3.5">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((index) => index - 1)}
            className="cursor-pointer rounded-lg border border-gray-200 bg-white px-5.5 py-3 text-sm font-semibold text-[#333333] transition-colors hover:border-[#1C5DD4] hover:text-[#1C5DD4] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-[#333333]"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={!selectedOptionId || isSubmitting}
            onClick={handleNext}
            className="cursor-pointer rounded-lg bg-[#1C5DD4] px-6.5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#174FB4] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLast ? (isSubmitting ? "Submitting…" : "Submit quiz") : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
