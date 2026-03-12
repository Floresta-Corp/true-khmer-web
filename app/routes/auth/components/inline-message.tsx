import { cn } from "~/lib/utils";

type InlineMessageTone = "error" | "info" | "success" | "warning";

type InlineMessageProps = {
  message?: string;
  tone?: InlineMessageTone;
  className?: string;
};

const toneClassMap: Record<InlineMessageTone, string> = {
  error: "text-red-500",
  info: "text-blue-600",
  success: "text-emerald-600",
  warning: "text-amber-600",
};

export function InlineMessage({
  message,
  tone = "info",
  className,
}: InlineMessageProps) {
  if (!message) return null;

  return (
    <p className={cn("text-center text-sm", toneClassMap[tone], className)}>
      {message}
    </p>
  );
}
