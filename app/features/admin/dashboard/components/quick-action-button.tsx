import { motion } from "motion/react";
import { Link } from "react-router";
import { Plus } from "lucide-react";
import type { QuickAction } from "../admin-dashboard";

interface QuickActionButtonProps {
  action: QuickAction;
}

export function QuickActionButton({ action }: QuickActionButtonProps) {
  const Icon = action.icon;
  const inner = (
    <div className="w-full p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group transition-all cursor-pointer">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 shrink-0 rounded-xl ${action.iconClass} flex items-center justify-center`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-(--admin-text)">
            {action.label}
          </p>
          <p className="text-[10px] text-(--admin-text-muted) uppercase font-black tracking-widest mt-0.5">
            {action.subtitle}
          </p>
        </div>
      </div>
      <Plus className="w-4 h-4 text-(--admin-text-muted) group-hover:translate-x-1 transition-transform" />
    </div>
  );
  return (
    <motion.div whileHover={{ x: 4 }}>
      {action.to ? <Link to={action.to}>{inner}</Link> : inner}
    </motion.div>
  );
}
