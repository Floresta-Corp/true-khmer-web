import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import type { StatItem } from "../types";

const MotionLink = motion.create(Link);

interface KpiCardProps {
  item: StatItem;
  index: number;
}

export function KpiCard({ item, index }: KpiCardProps) {
  const Icon = item.icon;
  const content = (
    <>
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
      <div className="px-5 py-3 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between group-hover/card:bg-slate-50 dark:group-hover/card:bg-slate-800 transition-all">
        <span className="text-sm font-bold text-slate-500 group-hover/card:text-slate-900 dark:group-hover/card:text-white transition-colors">
          {item.disabled ? "Restricted" : "See in details"}
        </span>
        <ArrowRight
          size={16}
          className="text-slate-300 group-hover/card:text-slate-900 dark:group-hover/card:text-white group-hover/card:translate-x-1 transition-all"
        />
      </div>
    </>
  );

  if (item.disabled) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="group/card overflow-hidden rounded-xl border border-(--admin-border) dark:bg-slate-900 opacity-60 select-none"
        aria-disabled="true"
      >
        {content}
      </motion.div>
    );
  }

  return (
    <MotionLink
      to={item.to}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -3 }}
      className="group/card overflow-hidden rounded-xl border border-(--admin-border) dark:bg-slate-900 transition-shadow block"
    >
      {content}
    </MotionLink>
  );
}
