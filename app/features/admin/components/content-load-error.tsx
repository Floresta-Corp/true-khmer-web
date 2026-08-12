import { RotateCcw, TriangleAlert } from "lucide-react";
import { useRevalidator } from "react-router";

/**
 * Fallback for a rejected list promise. Without an `errorElement` on the
 * surrounding `<Await>`, the rejection escapes to the route error boundary and
 * takes the whole screen — header, toolbar, and the filters the moderator just
 * set. Confining it here keeps those on screen and offers a retry.
 */
export default function ContentLoadError({ noun }: { noun: string }) {
  const { revalidate, state } = useRevalidator();

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center dark:border-slate-800 dark:bg-slate-900"
    >
      <span className="flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 dark:bg-amber-500/10">
        <TriangleAlert size={22} />
      </span>
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
        Could not load {noun}
      </p>
      <p className="max-w-sm text-xs text-slate-400 dark:text-slate-500">
        The request failed before any results came back. Your filters are still
        applied — retrying will use them.
      </p>
      <button
        type="button"
        onClick={() => revalidate()}
        disabled={state === "loading"}
        className="mt-1 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
      >
        <RotateCcw
          size={13}
          className={state === "loading" ? "animate-spin" : undefined}
        />
        {state === "loading" ? "Retrying…" : "Retry"}
      </button>
    </div>
  );
}

/**
 * Stand-in for the header count pill when its promise rejects. Keeps the pill's
 * footprint so the header does not reflow, and says nothing it cannot back up.
 */
export function ContentCountUnavailable() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500">
      <span className="size-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
      Count unavailable
    </span>
  );
}
