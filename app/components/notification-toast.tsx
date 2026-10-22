import type { ReactNode } from "react";
import { ArrowRight, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "~/lib/utils";

export interface NotificationToastOptions {
  icon: ReactNode;
  title: string;
  body: string;
  imageUrl?: string | null;
  /** Called when the user taps the card or the "View" button. */
  onView?: () => void;
  actionLabel?: string;
  /** Tailwind gradient classes for the icon chip / accent (e.g. "from-blue-500 to-indigo-500"). */
  accentClassName?: string;
  duration?: number;
}

const DEFAULT_DURATION = 5500;
// Brand primary (#2F6FE4) → a deeper shade of the same hue.
const DEFAULT_ACCENT = "from-[#2F6FE4] to-[#1E5AD0]";

function NotificationToastCard({
  toastId,
  icon,
  title,
  body,
  imageUrl,
  onView,
  actionLabel = "View",
  accentClassName = DEFAULT_ACCENT,
  duration = DEFAULT_DURATION,
  onDismiss,
}: NotificationToastOptions & {
  toastId: string | number;
  /** Runs synchronously on X / View, before Sonner's deferred dismissal. */
  onDismiss?: () => void;
}) {
  function dismiss() {
    onDismiss?.();
    toast.dismiss(toastId);
  }

  function handleView() {
    onView?.();
    dismiss();
  }

  return (
    <div
      className={cn(
        "group pointer-events-auto relative w-95 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border backdrop-blur-xl transition-all",
        "border-slate-200/70 bg-white/95 shadow-[0_16px_48px_-16px_rgba(15,23,42,0.35)]",
        "dark:border-white/10 dark:bg-slate-900/90 dark:shadow-[0_16px_48px_-16px_rgba(0,0,0,0.7)]",
        onView && "cursor-pointer hover:-translate-y-0.5",
      )}
      onClick={onView ? handleView : undefined}
      role={onView ? "button" : undefined}
    >
      {/* Top accent strip */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r opacity-80",
          accentClassName,
        )}
      />

      <div className="flex items-start gap-3 p-4">
        {/* Icon chip */}
        <div
          className={cn(
            "relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br text-white shadow-lg",
            accentClassName,
          )}
        >
          {icon}
          <span className="absolute inset-0 rounded-xl ring-1 ring-white/25 ring-inset" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-[13px] leading-tight font-semibold text-slate-900 dark:text-white">
              {title}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                dismiss();
              }}
              aria-label="Dismiss notification"
              className="-mt-0.5 -mr-1 shrink-0 rounded-md p-1 text-slate-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="size-3.5" />
            </button>
          </div>

          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {body}
          </p>

          {onView && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleView();
              }}
              className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold tracking-wide text-[#2F6FE4] transition-colors hover:text-[#1E5AD0] dark:text-[#6FA0F0] dark:hover:text-[#8DB4F4]"
            >
              {actionLabel}
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
        </div>

        {/* Optional thumbnail */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt=""
            className="size-11 shrink-0 rounded-xl object-cover ring-1 ring-slate-200/70 dark:ring-white/10"
          />
        )}
      </div>

      {/* Auto-dismiss progress bar */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-slate-100/70 dark:bg-white/5">
        <div
          className={cn(
            "h-full origin-left bg-linear-to-r group-hover:paused",
            accentClassName,
          )}
          style={{ animation: `toast-progress ${duration}ms linear forwards` }}
        />
      </div>
    </div>
  );
}

const ACTION_TOAST_ID_PREFIX = "action-success:";
let nextActionToastId = 0;
let lastAchievementCardAt = 0;

/** A success toast for an action that may also earn points or a badge. */
export function showActionSuccessToast(message: string) {
  if (Date.now() - lastAchievementCardAt < DEFAULT_DURATION) return;
  toast.success(message, {
    id: `${ACTION_TOAST_ID_PREFIX}${nextActionToastId++}`,
  });
}

function replaceActionSuccessToasts() {
  lastAchievementCardAt = Date.now();
  for (const active of toast.getToasts()) {
    if (String(active.id).startsWith(ACTION_TOAST_ID_PREFIX)) {
      toast.dismiss(active.id);
    }
  }
}

let nextGroupToastId = 0;

export function createNotificationToastGroup<T>(
  summarize: (items: T[]) => NotificationToastOptions,
) {
  let active: { id: string; items: T[] } | null = null;

  return function push(
    item: T,
    { isAchievement = false }: { isAchievement?: boolean } = {},
  ) {
    if (isAchievement) replaceActionSuccessToasts();
    active ??= { id: `notification-group:${nextGroupToastId++}`, items: [] };
    const group = active;
    group.items.push(item);

    const opts = summarize(group.items);
    const duration = opts.duration ?? DEFAULT_DURATION;
    const release = () => {
      if (active === group) active = null;
    };
    toast.custom(
      (id) => (
        <NotificationToastCard
          // Remount on every push so the progress bar restarts with the timer.
          key={group.items.length}
          toastId={id}
          {...opts}
          duration={duration}
          onDismiss={release}
        />
      ),
      { id: group.id, duration, onDismiss: release, onAutoClose: release },
    );
  };
}

/** Distinct strings in first-seen order, repeats marked "×n". */
export function summarizeLines(lines: string[]) {
  const counts = new Map<string, number>();
  for (const line of lines) counts.set(line, (counts.get(line) ?? 0) + 1);
  return [...counts].map(([line, n]) => (n > 1 ? `${line} ×${n}` : line));
}
