import { motion } from "motion/react";
import { Link } from "react-router";
import type { QuickAction } from "../types";

interface QuickActionsCardProps {
  actions: QuickAction[];
  className?: string;
}

function ActionItem({ action }: { action: QuickAction }) {
  const Icon = action.icon;
  const body = (
    <>
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${action.iconClass}`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-center text-[11.5px] leading-tight font-semibold text-(--admin-text)">
        {action.label}
      </span>
    </>
  );

  const base = "flex flex-col items-center gap-2 rounded-xl px-1 py-2";
  const interactive = `${base} transition-colors hover:bg-(--admin-card-muted) focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none`;

  if (action.to) {
    return (
      <Link to={action.to} className={interactive}>
        {body}
      </Link>
    );
  }

  if (action.onSelect) {
    return (
      <button type="button" onClick={action.onSelect} className={interactive}>
        {body}
      </button>
    );
  }

  // Disabled tiles stay real buttons so keyboard and screen-reader users still
  // find them — and hear why they are unavailable.
  const reason = action.disabledReason ?? "Coming soon";
  return (
    <button
      type="button"
      // aria-disabled rather than `disabled`: it keeps the tile focusable, so
      // the reason is actually reachable by keyboard.
      aria-disabled="true"
      title={reason}
      aria-label={`${action.label} — ${reason}`}
      className={`${base} cursor-default opacity-50 select-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none`}
    >
      {body}
    </button>
  );
}

export function QuickActionsCard({
  actions,
  className = "",
}: QuickActionsCardProps) {
  const allComingSoon = actions.every(
    (action) => !action.to && !action.onSelect,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={`rounded-2xl border border-(--admin-border) bg-(--admin-card-bg) p-5 ${className}`}
    >
      <div className="mb-3.5 flex items-center gap-2">
        <h3 className="text-lg font-bold text-(--admin-text)">Quick actions</h3>
        {allComingSoon && (
          <span className="rounded-full bg-(--admin-card-muted) px-2 py-0.75 text-[10.5px] font-bold tracking-wide text-(--admin-text-secondary) uppercase">
            Coming soon
          </span>
        )}
      </div>

      <div className="grid grid-cols-5 gap-2.5">
        {actions.map((action) => (
          <ActionItem key={action.id} action={action} />
        ))}
      </div>
    </motion.div>
  );
}
