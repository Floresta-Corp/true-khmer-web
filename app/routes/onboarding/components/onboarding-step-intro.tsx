import type { ReactNode } from "react";

type OnboardingStepIntroProps = {
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
  title: ReactNode;
  description: ReactNode;
  centered?: boolean;
  stepBadgeClassName?: string;
  stepTextClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export function OnboardingStepIntro({
  currentStep,
  totalSteps,
  stepLabel,
  title,
  description,
  centered = false,
  stepBadgeClassName = "rounded-full border border-black/10 px-3.5 py-2",
  stepTextClassName = "text-xs uppercase tracking-[0.16em] text-[#2F6FE4]",
  titleClassName = "text-2xl font-semibold leading-8 text-[#030213]",
  descriptionClassName = "text-sm font-normal leading-5 text-[#99A1AF]",
}: OnboardingStepIntroProps) {
  return (
    <div
      className={`tk-fade-up flex w-full flex-col gap-5 ${centered ? "items-center" : "items-start"}`}
    >
      <div className="inline-flex items-center gap-1.5">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          return (
            <div
              key={stepNumber}
              className={`h-2 rounded-[64px] ${isActive ? "w-6 bg-[#2894FA]" : "w-2 bg-[#BFDBFE]"}`}
            />
          );
        })}
      </div>

      <div className={`inline-flex ${stepBadgeClassName}`}>
        <p className={stepTextClassName}>
          <span className="font-normal">
            Step {currentStep} of {totalSteps} —{" "}
          </span>
          <span className="font-bold">{stepLabel}</span>
        </p>
      </div>

      <div
        className={`w-full space-y-1.5 ${centered ? "text-center" : "text-left"}`}
      >
        <h1 className={titleClassName}>{title}</h1>
        <p className={descriptionClassName}>{description}</p>
      </div>
    </div>
  );
}
