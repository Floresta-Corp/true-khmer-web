import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";

type OnboardingBackContinueActionsProps = {
  backTo: string;
  backLabel?: string;
  continueLabel?: string;
  continueDisabled?: boolean;
  showContinueIcon?: boolean;
  containerClassName?: string;
  backButtonClassName?: string;
  continueButtonClassName?: string;
};

export function OnboardingBackContinueActions({
  backTo,
  backLabel = "Back",
  continueLabel = "Continue",
  continueDisabled = false,
  showContinueIcon = true,
  containerClassName,
  backButtonClassName,
  continueButtonClassName,
}: OnboardingBackContinueActionsProps) {
  return (
    <div
      className={cn(
        "inline-flex w-full items-start justify-between",
        containerClassName,
      )}
    >
      <Link
        to={backTo}
        className={cn(
          "inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#CBD5E1] bg-white px-6 text-sm font-medium text-[#0F172B] shadow-[0px_1px_2px_rgba(0,0,0,0.05)]",
          backButtonClassName,
        )}
      >
        <ArrowLeft size={20} />
        {backLabel}
      </Link>

      <button
        type="submit"
        disabled={continueDisabled}
        className={cn(
          "inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#2F6FE4] px-6 text-sm font-medium text-white",
          continueDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          continueButtonClassName,
        )}
      >
        {continueLabel}
        {showContinueIcon ? <ArrowRight size={20} /> : null}
      </button>
    </div>
  );
}
