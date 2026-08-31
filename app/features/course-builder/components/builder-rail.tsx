import { BackLink } from "~/components/back-link";
import { Check, ChevronLeft } from "lucide-react";
import { cn } from "~/lib/utils";
import { STEP_DEFINITIONS } from "../lib/builder-steps";
import type { BuilderStep } from "../types";

interface BuilderRailProps {
  /** Only the steps this course has — the list is conditional. */
  steps: BuilderStep[];
  current: BuilderStep;
  title: string;
  onStepSelect: (step: BuilderStep) => void;
}

/**
 * The design's 300px left rail: a back link, the title, then one row per step
 * with a status circle and a connector line down to the next.
 */
export function BuilderRail({
  steps,
  current,
  title,
  onStepSelect,
}: BuilderRailProps) {
  const currentIndex = steps.indexOf(current);

  return (
    <div className="sticky top-0 hidden h-screen w-75 shrink-0 flex-col self-start overflow-y-auto border-r border-[#E5E7EB] bg-[#F9FAFC] px-7 py-8 lg:flex">
      <BackLink
        to="/course-listing"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1C5DD4] hover:underline"
      >
        <ChevronLeft size={15} strokeWidth={2.4} aria-hidden />
        My courses
      </BackLink>

      <h1 className="mt-5.5 mb-6.5 text-[26px] leading-[1.2] font-extrabold text-[#1A1A2E]">
        {title}
      </h1>

      <div className="flex flex-col">
        {steps.map((step, index) => {
          const definition = STEP_DEFINITIONS[step];
          const Icon = definition.icon;
          const isCurrent = step === current;
          const isDone = index < currentIndex;
          const isLast = index === steps.length - 1;

          return (
            <div key={step} className="flex min-h-19 gap-3.5">
              <div className="flex shrink-0 flex-col items-center">
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full border",
                    isDone && "border-[#1C5DD4] bg-[#1C5DD4] text-white",
                    isCurrent && "border-[#1C5DD4] bg-[#D5E2FA] text-[#1C5DD4]",
                    !isDone &&
                      !isCurrent &&
                      "border-[#E5E7EB] bg-white text-[#9A9AB0]",
                  )}
                >
                  {isDone ? (
                    <Check size={16} strokeWidth={2.6} aria-hidden />
                  ) : (
                    <Icon size={16} strokeWidth={2} aria-hidden />
                  )}
                </span>
                {!isLast && (
                  <span className="min-h-5.5 w-0.5 flex-1 bg-[#E5E7EB]" />
                )}
              </div>

              <button
                type="button"
                onClick={() => onStepSelect(step)}
                aria-current={isCurrent ? "step" : undefined}
                className="min-w-0 cursor-pointer pt-1.5 text-left"
              >
                <span
                  className={cn(
                    "block text-sm font-bold",
                    isCurrent || isDone ? "text-[#1A1A2E]" : "text-[#9A9AB0]",
                  )}
                >
                  {definition.label}
                </span>
                <span className="mt-0.5 block text-xs text-[#9A9AB0]">
                  {definition.desc}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
