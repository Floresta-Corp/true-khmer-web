import type { ComponentProps, ReactNode } from "react";

import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";

/** Shared control sizing so inputs, textareas, and selects line up. */
export const fieldControlClass =
  "h-11 rounded-xl px-3.5 text-base shadow-none md:text-sm dark:border-slate-700 dark:bg-slate-950/50 dark:text-white";

export function FieldLabel({
  required = false,
  className,
  children,
  ...props
}: ComponentProps<typeof Label> & { required?: boolean }) {
  return (
    <Label
      className={cn(
        "mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200",
        className,
      )}
      {...props}
    >
      {children}
      {required && <span className="ml-0.5 text-rose-500">*</span>}
    </Label>
  );
}

export function FieldHint({ children }: { children: ReactNode }) {
  return (
    <p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
      {children}
    </p>
  );
}
