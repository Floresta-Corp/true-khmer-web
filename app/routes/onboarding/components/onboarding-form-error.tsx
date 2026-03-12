import { cn } from "~/lib/utils";

type OnboardingFormErrorProps = {
  message?: string | null;
  className?: string;
  preserveLineBreaks?: boolean;
};

export function OnboardingFormError({
  message,
  className,
  preserveLineBreaks = false,
}: OnboardingFormErrorProps) {
  if (!message) return null;

  return (
    <p
      className={cn(
        "text-sm text-red-500",
        preserveLineBreaks && "whitespace-pre-line",
        className,
      )}
    >
      {message}
    </p>
  );
}
