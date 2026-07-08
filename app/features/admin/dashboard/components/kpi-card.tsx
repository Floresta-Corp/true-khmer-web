import { useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import type { StatItem } from "../types";

const MotionLink = motion.create(Link);

// Cards should animate in once per session. Any incidental re-render or
// remount afterwards (e.g. from a notification context update) must not
// replay the entrance animation. Tracked module-side so it survives remounts.
const animatedCardIds = new Set<string>();

interface KpiCardProps {
  item: StatItem;
  index: number;
}

export function KpiCard({ item, index }: KpiCardProps) {
  const Icon = item.icon;

  const hasAnimated = animatedCardIds.has(item.id);
  useEffect(() => {
    animatedCardIds.add(item.id);
  }, [item.id]);

  const entranceInitial = hasAnimated ? false : { opacity: 0, y: 20 };
  const entranceTransition = hasAnimated
    ? { duration: 0 }
    : { duration: 0.4, delay: index * 0.1 };
  const content = (
    <>
      <div className="flex items-start gap-4 p-5">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}
        >
          <Icon className={`h-5 w-5 ${item.iconColor}`} />
        </div>
        <div>
          <p className="text-[13px] text-(--admin-text-secondary)">
            {item.label}
          </p>
          <p className="mt-1 text-[30px] leading-none font-bold tracking-tight text-(--admin-text)">
            {item.value}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-5 py-3 transition-all group-hover/card:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/30 dark:group-hover/card:bg-slate-800">
        <span className="text-sm font-bold text-slate-500 transition-colors group-hover/card:text-slate-900 dark:group-hover/card:text-white">
          {item.disabled ? "Restricted" : "See in details"}
        </span>
        <ArrowRight
          size={16}
          className="text-slate-300 transition-all group-hover/card:translate-x-1 group-hover/card:text-slate-900 dark:group-hover/card:text-white"
        />
      </div>
    </>
  );

  if (item.disabled) {
    return (
      <motion.div
        initial={entranceInitial}
        animate={{ opacity: 1, y: 0 }}
        transition={entranceTransition}
        className="group/card overflow-hidden rounded-xl border border-(--admin-border) opacity-60 select-none dark:bg-slate-900"
        aria-disabled="true"
      >
        {content}
      </motion.div>
    );
  }

  return (
    <MotionLink
      to={item.to}
      initial={entranceInitial}
      animate={{ opacity: 1, y: 0 }}
      transition={entranceTransition}
      whileHover={{ y: -3 }}
      className="group/card block overflow-hidden rounded-xl border border-(--admin-border) transition-shadow dark:bg-slate-900"
    >
      {content}
    </MotionLink>
  );
}
