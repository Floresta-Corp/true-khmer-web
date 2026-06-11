import { CheckCircle2 } from "lucide-react";

// ── EmptyState ─────────────────────────────────────────────────────────────
// Shown when no reports match the active filters.

export function EmptyState() {
  return (
    <div className="py-20 text-center">
      <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-(--admin-text)">All Clear!</h3>
      <p className="text-(--admin-text-muted) font-medium mt-1">
        No reports match your filters.
      </p>
    </div>
  );
}
