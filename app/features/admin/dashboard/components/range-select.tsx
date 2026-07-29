import { useState } from "react";
import { Calendar, ChevronDown, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { BRAND_COLOR, type RangeOption } from "../types";

interface RangeSelectProps {
  options: RangeOption[];
  /** id of the option selected by default (uncontrolled mode). */
  defaultId?: string;
  /** Controlled selected id — when provided, the parent owns the value. */
  value?: string;
  /** Called with the newly-selected option id. */
  onChange?: (id: string) => void;
  /** Disable interaction (e.g. while a refetch is in flight). */
  disabled?: boolean;
  /** Show a calendar icon (used for the page-level date chip). */
  withCalendar?: boolean;
  /** Accessible name for the trigger. */
  label?: string;
  className?: string;
}

/**
 * A lightweight preset range picker. Works either uncontrolled (via
 * `defaultId`) or controlled (via `value` + `onChange`). Chart cards drive it
 * in controlled mode to refetch their own endpoint when the range changes.
 *
 * Built on Radix Popover so Escape, outside-click and focus management come for
 * free; the panel is a real listbox so screen readers announce the selection.
 */
export function RangeSelect({
  options,
  defaultId,
  value,
  onChange,
  disabled = false,
  withCalendar = false,
  label = "Select date range",
  className = "",
}: RangeSelectProps) {
  const [open, setOpen] = useState(false);
  const [internalId, setInternalId] = useState(defaultId ?? options[0]?.id);
  const selectedId = value ?? internalId;
  // Fall back to the raw id rather than options[0]'s label — silently showing
  // the wrong range is worse than showing an unfamiliar one.
  const selectedLabel =
    options.find((o) => o.id === selectedId)?.label ?? selectedId ?? "";

  const select = (id: string) => {
    setInternalId(id);
    setOpen(false);
    onChange?.(id);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={label}
          aria-haspopup="listbox"
          className={`flex items-center gap-2 rounded-lg border border-(--admin-border) bg-(--admin-card-bg) px-3 py-2 text-[13px] font-medium text-(--admin-text) transition-colors hover:bg-(--admin-card-muted) disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
        >
          {withCalendar && (
            <Calendar className="h-4 w-4 text-(--admin-text-secondary)" />
          )}
          <span>{selectedLabel}</span>
          <ChevronDown
            className={`h-4 w-4 text-(--admin-text-secondary) transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-52 gap-0 rounded-xl border border-(--admin-border) bg-(--admin-card-bg) p-1"
      >
        <div className="px-3 pt-1.5 pb-2 text-[11px] font-bold tracking-wide text-(--admin-text-secondary) uppercase">
          Quick ranges
        </div>
        <div role="listbox" aria-label={label}>
          {options.map((o) => {
            const active = o.id === selectedId;
            return (
              <button
                key={o.id}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => select(o.id)}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors hover:bg-(--admin-card-muted) focus-visible:bg-(--admin-card-muted) focus-visible:outline-none"
                style={active ? { color: BRAND_COLOR } : undefined}
              >
                <Calendar
                  className={`h-4 w-4 shrink-0 ${active ? "" : "text-(--admin-text-secondary)"}`}
                />
                <span className={active ? "" : "text-(--admin-text)"}>
                  {o.label}
                </span>
                <span className="ml-auto">
                  {active && <Check className="h-4 w-4" />}
                </span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
