import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import type { StatItem } from "../types";

interface KpiCardProps {
  item: StatItem;
  index: number;
}

export function KpiCard({ item, index }: KpiCardProps) {
  const Icon = item.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -3 }}
      className="overflow-hidden rounded-xl border border-(--admin-border) dark:bg-slate-900 transition-shadow"
    >
      <div className="flex items-start gap-4 p-5">
        <div
          className={`h-11 w-11 shrink-0 rounded-xl flex items-center justify-center ${item.iconBg}`}
        >
          <Icon className={`h-5 w-5 ${item.iconColor}`} />
        </div>
        <div>
          <p className="text-[13px] text-(--admin-text-secondary)">
            {item.label}
          </p>
          <p className="mt-1 text-[30px] font-bold leading-none tracking-tight text-(--admin-text)">
            {item.value}
          </p>
        </div>
      </div>
      <Link
        to={item.to}
        className="px-5 py-3 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between group/btn hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left w-full"
      >
        <span className="text-sm font-bold text-slate-500 group-hover/btn:text-slate-900 dark:group-hover/btn:text-white transition-colors">
          See in details
        </span>
        <ArrowRight
          size={16}
          className="text-slate-300 group-hover/btn:text-slate-900 dark:group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all"
        />
      </Link>
    </motion.div>
  );
}
