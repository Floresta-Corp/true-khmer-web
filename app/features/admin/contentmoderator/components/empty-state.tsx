import { CheckCircle2 } from "lucide-react";

// ── EmptyState ─────────────────────────────────────────────────────────────
// Shown when no reports match the active filters.

export function EmptyState() {
  return (
    <div className="py-20 text-center">
      <CheckCircle2 size={48} className="text-slate-200 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-white">All Clear!</h3>
      <p className="text-slate-500 font-medium mt-1">
        No reports match your filters.
      </p>
    </div>
  );
}
