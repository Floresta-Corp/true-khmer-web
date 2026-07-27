import { useState } from "react";
import { Calendar, ChevronDown, Check } from "lucide-react";
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
  className?: string;
}

/**
 * A lightweight preset range picker. Works either uncontrolled (via
 * `defaultId`) or controlled (via `value` + `onChange`). Chart cards drive it
 * in controlled mode to refetch their own endpoint when the range changes.
 */
export function RangeSelect({
  options,
  defaultId,
  value,
  onChange,
  disabled = false,
  withCalendar = false,
  className = "",
}: RangeSelectProps) {
  const [open, setOpen] = useState(false);
  const [internalId, setInternalId] = useState(defaultId ?? options[0]?.id);
  const selectedId = value ?? internalId;
  const selected =
    options.find((o) => o.id === selectedId)?.label ?? options[0]?.label;

  const select = (id: string) => {
    setInternalId(id);
    setOpen(false);
    onChange?.(id);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-(--admin-border) bg-(--admin-card-bg) px-3 py-2 text-[13px] font-medium text-(--admin-text) transition-colors hover:bg-(--admin-card-muted) disabled:cursor-not-allowed disabled:opacity-60"
      >
        {withCalendar && (
          <Calendar className="h-4 w-4 text-(--admin-text-secondary)" />
        )}
        <span>{selected}</span>
        <ChevronDown className="h-4 w-4 text-(--admin-text-secondary)" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute top-[calc(100%+6px)] right-0 z-50 w-52 rounded-xl border border-(--admin-border) bg-(--admin-card-bg) p-1">
            <div className="px-3 pt-1.5 pb-2 text-[11px] font-bold tracking-wide text-(--admin-text-secondary) uppercase">
              Quick ranges
            </div>
            {options.map((o) => {
              const active = o.id === selectedId;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => select(o.id)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors hover:bg-(--admin-card-muted)"
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
        </>
      )}
    </div>
  );
}
