import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import { Flag, CheckCircle2, FileText, Clock } from "lucide-react";
import { motion } from "motion/react";
import type { ContentModeratorStats } from "../types";

type StatCard = {
  id: string;
  label: string;
  value: number | string;
  icon: ComponentType<LucideProps>;
  iconBg: string;
  iconColor: string;
};

export function ReportStatsCards({ stats }: { stats: ContentModeratorStats }) {
  const cards: StatCard[] = [
    {
      id: "open",
      label: "Open Reports",
      value: stats.openReports ?? 0,
      icon: Flag,
      iconBg: "bg-rose-50 dark:bg-rose-950/50",
      iconColor: "text-rose-500 dark:text-rose-400",
    },
    {
      id: "resolved",
      label: "Resolved Reports",
      value: stats.resolvedReports ?? 0,
      icon: CheckCircle2,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/50",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      id: "total",
      label: "Total Reports",
      value: stats.totalReports ?? 0,
      icon: FileText,
      iconBg: "bg-blue-50 dark:bg-blue-950/50",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "avg",
      label: "Avg. Resolution Time",
      value: stats.avgResolutionTime ?? "—",
      icon: Clock,
      iconBg: "bg-indigo-50 dark:bg-indigo-950/50",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.06 }}
            className="flex items-center gap-4 rounded-2xl border border-(--admin-border) bg-white p-5 dark:bg-slate-900"
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${card.iconBg}`}
            >
              <Icon className={`h-5.5 w-5.5 ${card.iconColor}`} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-(--admin-text-secondary)">
                {card.label}
              </p>
              <p className="mt-0.5 text-2xl font-bold tracking-tight text-(--admin-text)">
                {card.value}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
