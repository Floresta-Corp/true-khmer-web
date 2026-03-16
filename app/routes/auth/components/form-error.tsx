import { cn } from "~/lib/utils";

type FormErrorProps = {
  message?: string;
  className?: string;
};

export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600",
        className,
      )}
    >
      {message}
    </div>
  );
}
