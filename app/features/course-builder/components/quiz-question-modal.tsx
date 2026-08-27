import { Check, Trash2, X } from "lucide-react";
import { cn } from "~/lib/utils";
import { MAX_ANSWER_COUNT } from "~/features/course-builder/types";
import type { QuizDraft } from "../lib/use-quiz-draft";

/** Editor for one question and its choices, as the design's modal does it. */
export function QuizQuestionModal({ quiz }: { quiz: QuizDraft }) {
  const active = quiz.activeQuestion;
  if (!active) return null;

  const { question, number } = active;
  const id = question.id;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Question ${number}`}
      onClick={quiz.closeQuestion}
      className="fixed inset-0 z-95 flex items-center justify-center bg-[rgba(26,26,46,0.45)] p-5"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="max-h-[82vh] w-full max-w-[520px] overflow-y-auto rounded-xl bg-white px-[30px] py-7 shadow-[0_20px_60px_rgba(26,26,46,0.25)]"
      >
        <div className="mb-[18px] flex items-center justify-between gap-3">
          <h3 className="text-[18px] font-bold text-[#1A1A2E]">
            Question {number}
          </h3>
          <button
            type="button"
            aria-label="Close"
            onClick={quiz.closeQuestion}
            className="cursor-pointer text-[#9A9AB0]"
          >
            <X size={20} aria-hidden />
          </button>
        </div>

        <input
          value={question.text}
          onChange={(event) =>
            quiz.updateQuestion(id, { text: event.target.value })
          }
          placeholder="Type your question…"
          aria-label="Question text"
          className="mb-4 w-full rounded-lg border border-[#E5E7EB] px-3.5 py-3 text-[15px] font-semibold text-[#1A1A2E] outline-none focus:border-[#1C5DD4]"
        />

        <div className="flex flex-col gap-2.5">
          {question.answers.map((answer, index) => (
            <div key={answer.id} className="flex items-center gap-3">
              <button
                type="button"
                title="Mark as correct answer"
                aria-label={`Mark choice ${index + 1} as correct`}
                aria-pressed={answer.correct}
                onClick={() => quiz.markCorrect(id, answer.id)}
                className={cn(
                  "flex size-[26px] shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-colors",
                  answer.correct
                    ? "border-[#1FC16B] bg-[#1FC16B] text-white"
                    : "border-[#C9CBD4] text-transparent",
                )}
              >
                <Check size={14} strokeWidth={3} aria-hidden />
              </button>

              <input
                value={answer.text}
                onChange={(event) =>
                  quiz.setAnswerText(id, answer.id, event.target.value)
                }
                placeholder={`Choice ${index + 1}`}
                aria-label={`Choice ${index + 1}`}
                className="min-w-0 flex-1 rounded-lg border border-[#E5E7EB] px-3.5 py-2.5 text-sm text-[#333333] outline-none focus:border-[#1C5DD4]"
              />

              {question.answers.length > 2 && (
                <button
                  type="button"
                  aria-label={`Remove choice ${index + 1}`}
                  onClick={() => quiz.removeAnswer(id, answer.id)}
                  className="flex size-[26px] shrink-0 cursor-pointer items-center justify-center text-[#9A9AB0] hover:text-[#DC2626]"
                >
                  <Trash2 size={14} aria-hidden />
                </button>
              )}
            </div>
          ))}
        </div>

        {question.answers.length < MAX_ANSWER_COUNT && (
          <button
            type="button"
            onClick={() => quiz.addAnswer(id)}
            className="mt-3.5 w-full cursor-pointer rounded-lg border-[1.5px] border-dashed border-[#E5E7EB] py-3 text-[13px] font-bold text-[#1C5DD4]"
          >
            + Add choice
          </button>
        )}

        <div className="mt-[22px] flex items-center justify-between">
          <button
            type="button"
            onClick={() => quiz.removeQuestion(id)}
            className="inline-flex cursor-pointer items-center gap-1.5 px-1 py-2.5 text-[13px] font-bold text-[#DC2626]"
          >
            <Trash2 size={14} aria-hidden />
            Delete question
          </button>
          <button
            type="button"
            onClick={quiz.closeQuestion}
            className="ml-auto cursor-pointer rounded-lg bg-[#1C5DD4] px-[22px] py-2.5 text-sm font-bold text-white"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
