import { motion } from "motion/react";
import { Link } from "react-router";
import type { QuickAction } from "../types";

interface QuickActionsCardProps {
  actions: QuickAction[];
  className?: string;
}

function ActionItem({ action }: { action: QuickAction }) {
  const Icon = action.icon;

  const inner = (
    <>
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${action.iconClass}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-center text-[11px] font-medium text-(--admin-text-secondary)">
        {action.label}
      </span>
    </>
  );

  if (action.disabled) {
    return (
      <div
        aria-disabled="true"
        className="flex cursor-not-allowed flex-col items-center gap-2 opacity-50 select-none"
      >
        {inner}
      </div>
    );
  }

  const baseClass =
    "group flex cursor-pointer flex-col items-center gap-2 transition-colors";

  if (action.to) {
    return (
      <Link to={action.to} className={baseClass}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={action.onClick} className={baseClass}>
      {inner}
    </button>
  );
}

export function QuickActionsCard({
  actions,
  className = "",
}: QuickActionsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={`rounded-xl border border-(--admin-border) p-6 md:p-8 dark:bg-slate-900 ${className}`}
    >
      <h3 className="text-lg font-bold text-(--admin-text)">Quick actions</h3>

      <div className="mt-6 grid grid-cols-5 gap-3">
        {actions.map((action) => (
          <ActionItem key={action.id} action={action} />
        ))}
      </div>
    </motion.div>
  );
}
