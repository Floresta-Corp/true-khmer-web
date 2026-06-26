import { motion } from "motion/react";
import { QuickActionButton } from "./quick-action-button";
import type { QuickAction } from "../types";

interface QuickActionsSidebarProps {
  actions: QuickAction[];
}

export function QuickActionsSidebar({ actions }: QuickActionsSidebarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="lg:col-span-4 rounded-xl border border-(--admin-border) dark:bg-slate-900 flex flex-col"
    >
      <div className="px-6 py-5 border-b border-(--admin-border) dark:border-slate-800">
        <h3 className="text-[15px] font-semibold text-(--admin-text)">
          Quick Actions
        </h3>
        <p className="mt-1 text-xs text-slate-400 ">Common management tasks</p>
      </div>
      <div className="flex-1 p-5 space-y-3">
        {actions.map((action) => (
          <QuickActionButton key={action.id} action={action} />
        ))}
      </div>
      <div className="p-5">
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-(--admin-border) dark:border-slate-800/50">
          <p className="text-[10px] font-black text-(--admin-text-secondary) uppercase tracking-widest mb-2">
            System status
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              All modules operational
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
