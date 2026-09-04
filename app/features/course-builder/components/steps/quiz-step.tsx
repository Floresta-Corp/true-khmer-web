import { useRef, useState } from "react";
import { GripVertical, Info, Lightbulb, Settings } from "lucide-react";
import { cn } from "~/lib/utils";
import type { QuizDraft } from "../../lib/use-quiz-draft";
import { Required } from "../required-mark";

const PANEL = "rounded-xl border border-[#E5E7EB] p-[22px]";
const SUB_HEAD = "text-[13px] font-bold text-[#1A1A2E]";

interface QuizStepProps {
  quiz: QuizDraft;
  /** Set when the step was left, or submitted, without a usable question. */
  error?: string;
}

export function QuizStep({ quiz, error }: QuizStepProps) {
  // dragRef carries the id through the drop handler, which fires on the target
  // row; the state is only there to paint the drag.
  const dragRef = useRef<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);

  const endDrag = () => {
    dragRef.current = null;
    setDragging(null);
    setOver(null);
  };

  return (
    <div className="grid items-start gap-5 xl:grid-cols-[1fr_340px]">
      {/* Questions — first in the DOM, and the design puts it left. */}
      <div className={`${PANEL} order-1 min-w-0`}>
        <div className="mb-4.5 flex items-start justify-between gap-3">
          <div>
            <h3 className="mb-0.75 text-base font-bold text-[#1A1A2E]">
              Questions
              <Required />
            </h3>
            <p className="text-[13px] leading-[1.4] text-[#9A9AB0]">
              Build your quiz by adding and managing questions.
            </p>
          </div>
          <button
            type="button"
            onClick={quiz.addQuestion}
            className="shrink-0 cursor-pointer rounded-lg bg-[#1C5DD4] px-4.5 py-2.5 text-[13px] font-bold whitespace-nowrap text-white"
          >
            + Add question
          </button>
        </div>

        {error && (
          <p className="mb-3 text-[13px] font-semibold text-[#FB3748]">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-2.5">
          {quiz.questions.map((question, index) => (
            <div
              key={question.id}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", question.id);
                dragRef.current = question.id;
                setDragging(question.id);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                const dragged = dragRef.current;
                if (dragged && dragged !== question.id) setOver(question.id);
              }}
              onDragLeave={() =>
                setOver((current) => (current === question.id ? null : current))
              }
              onDrop={(event) => {
                event.preventDefault();
                const dragged = dragRef.current;
                if (dragged) quiz.moveQuestion(dragged, question.id);
                endDrag();
              }}
              onDragEnd={endDrag}
              className={cn(
                "flex min-w-0 items-center overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white transition-colors hover:bg-[#F9FAFC]",
                dragging === question.id && "opacity-40",
                over === question.id &&
                  "bg-[#F3F6FD] shadow-[inset_0_2px_0_0_#1C5DD4]",
              )}
            >
              <span
                aria-hidden
                className="flex shrink-0 cursor-grab items-center py-3.5 pl-4 text-[#9A9AB0] active:cursor-grabbing"
              >
                <GripVertical size={15} />
              </span>

              <button
                type="button"
                onClick={() => quiz.openQuestion(question.id)}
                className="flex min-w-0 flex-1 cursor-pointer items-center gap-3.5 py-3.5 pr-4 pl-3.5 text-left"
              >
                <span className="shrink-0 rounded-md bg-[#D5E2FA] px-2.5 py-1.5 text-xs font-bold text-[#1C5DD4]">
                  Q{index + 1}
                </span>
                <span
                  className={cn(
                    "min-w-0 flex-1 truncate px-1.5 py-1 text-sm font-semibold",
                    question.text ? "text-[#1A1A2E]" : "text-[#9A9AB0]",
                  )}
                >
                  {question.text || "Untitled question"}
                </span>
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={quiz.addQuestion}
          className="mt-3 w-full cursor-pointer rounded-lg border-[1.5px] border-dashed border-[#E5E7EB] py-3 text-[13px] font-bold text-[#1C5DD4]"
        >
          + Add question
        </button>

        <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-[#EFF4FE] px-4 py-3.5">
          <Lightbulb
            size={16}
            aria-hidden
            className="mt-px shrink-0 text-[#1C5DD4]"
          />
          <span className="text-[13px] leading-normal text-[#1C5DD4]">
            <strong>Tip.</strong> Add at least 3–5 questions for a better
            learning experience.
          </span>
        </div>
      </div>

      {/* Quiz setup */}
      <div className={`${PANEL} order-2 min-w-0`}>
        <div className="mb-4.5 flex items-start gap-3">
          <span
            aria-hidden
            className="flex size-9.5 shrink-0 items-center justify-center rounded-[10px] bg-[#D5E2FA] text-[#1C5DD4]"
          >
            <Settings size={20} />
          </span>
          <div>
            <h3 className="mb-0.75 text-base font-bold text-[#1A1A2E]">
              Quiz setup
            </h3>
            <p className="text-[13px] leading-[1.4] text-[#9A9AB0]">
              Choose how the quiz works and set the passing score.
            </p>
          </div>
        </div>

        {/* A course has one quiz, at the end, so placement is stated rather
            than offered as a choice. */}
        <div className="border-t border-[#E5E7EB] pt-4.5">
          <div className={`${SUB_HEAD} mb-2.5`}>Quiz placement</div>
          <div className="rounded-lg border border-[#1C5DD4] bg-[#EFF4FE] p-3">
            <div className="text-[13px] font-bold text-[#1C5DD4]">
              Final quiz at the end of the course
            </div>
            <div className="mt-0.5 text-xs text-[#9A9AB0]">
              Learners take one quiz after finishing every chapter.
            </div>
          </div>
        </div>

        <div className="mt-5 border-t border-[#E5E7EB] pt-5">
          <label className={SUB_HEAD} htmlFor="quiz-pass-mark">
            Passing score
          </label>
          <p className="mt-0.5 mb-3 text-xs text-[#9A9AB0]">
            Minimum score to pass
          </p>

          <div className="relative w-full">
            <input
              id="quiz-pass-mark"
              type="number"
              min={0}
              max={100}
              value={quiz.passMark}
              onChange={(event) => quiz.setPassMark(event.target.value)}
              className="w-full rounded-lg border border-[#E5E7EB] py-3 pr-8.5 pl-3.25 text-[15px] font-semibold text-[#333333] outline-none focus:border-[#1C5DD4]"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-3.25 -translate-y-1/2 text-sm font-semibold text-[#9A9AB0]"
            >
              %
            </span>
          </div>

          <div className="mt-3 flex items-start gap-2">
            <Info
              size={15}
              aria-hidden
              className="mt-px shrink-0 text-[#9A9AB0]"
            />
            <span className="text-xs leading-normal text-[#9A9AB0]">
              Learners who score below this cannot earn the certificate, but can
              retake the quiz.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
