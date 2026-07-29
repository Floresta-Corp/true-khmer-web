import { motion } from "motion/react";
import type { QuickAction } from "../types";

interface QuickActionsCardProps {
  actions: QuickAction[];
  className?: string;
}

function ActionItem({ action }: { action: QuickAction }) {
  const Icon = action.icon;
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl px-1 py-2">
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${action.iconClass}`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-center text-[11.5px] leading-tight font-semibold text-(--admin-text)">
        {action.label}
      </span>
    </div>
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
      className={`rounded-2xl border border-(--admin-border) bg-(--admin-card-bg) p-5 ${className}`}
    >
      <div className="mb-3.5 flex items-center gap-2">
        <h3 className="text-lg font-bold text-(--admin-text)">Quick actions</h3>
        <span className="rounded-full bg-(--admin-card-muted) px-2 py-0.75 text-[10.5px] font-bold tracking-wide text-(--admin-text-secondary) uppercase">
          Coming soon
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2.5 opacity-50 select-none">
        {actions.map((action) => (
          <ActionItem key={action.id} action={action} />
        ))}
      </div>
    </motion.div>
  );
}
