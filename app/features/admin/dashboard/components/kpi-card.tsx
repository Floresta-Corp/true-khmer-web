import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import type { StatItem } from "../admin-dashboard";

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
      className="overflow-hidden rounded-xl border border-(--admin-border) bg-(--admin-card-bg) transition-shadow"
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
        className="flex items-center justify-between border-t border-(--admin-border) px-5 py-3 text-[13px] text-(--admin-text-muted) transition-colors hover:bg-(--admin-card-muted) hover:text-(--admin-text-secondary)"
      >
        <span>See in details</span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.div>
  );
}
