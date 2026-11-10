import type { LucideIcon } from "lucide-react";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

/**
 * Shown in place of a point list (benefits, responsibilities, requirements)
 * before anything is added, so the one action available is front and center.
 */
export function AddPointEmptyState({
  icon: Icon,
  message,
  onAdd,
  hasError = false,
  compact = false,
}: {
  icon?: LucideIcon;
  message: string;
  onAdd: () => void;
  hasError?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed text-center",
        compact ? "gap-2 px-4 py-5" : "gap-3 px-6 py-8",
        hasError
          ? "border-red-300 bg-red-50/40"
          : "border-[#CBD5E1] bg-[#F9FAFC]",
      )}
    >
      {Icon && (
        <span className="flex size-10 items-center justify-center rounded-full bg-[#EAF1FD]">
          <Icon className="size-5 text-[#2F6FE4]" aria-hidden="true" />
        </span>
      )}
      <p className="max-w-xs text-sm text-slate-500">{message}</p>
      <Button
        type="button"
        variant="outline"
        onClick={onAdd}
        className="gap-1.5 border-[#2F6FE4] text-sm font-semibold text-[#2F6FE4] hover:bg-[#EAF1FD] hover:text-[#245fca]"
      >
        <Plus className="size-4" aria-hidden="true" />
        Add point
      </Button>
    </div>
  );
}

/** Sits under a non-empty point list to append the next one. */
export function AddAnotherPointButton({
  onAdd,
  disabled = false,
}: {
  onAdd: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onAdd}
      disabled={disabled}
      className="w-full gap-1.5 border-dashed border-[#CBD5E1] text-sm font-semibold text-[#2F6FE4] hover:border-[#2F6FE4] hover:bg-[#EAF1FD] hover:text-[#245fca]"
    >
      <Plus className="size-4" aria-hidden="true" />
      Add another point
    </Button>
  );
}
