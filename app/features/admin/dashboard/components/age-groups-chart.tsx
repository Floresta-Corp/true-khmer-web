import { motion } from "motion/react";
import type { AgeItem } from "../types";
import { CATEGORICAL_COLORS } from "../types";

interface AgeGroupsChartProps {
  data: AgeItem[];
}

export function AgeGroupsChart({ data }: AgeGroupsChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.7 }}
      className="rounded-2xl border border-(--admin-border) bg-(--admin-card-bg) p-6"
    >
      <h3 className="text-base font-bold text-(--admin-text)">Age group</h3>
      <div className="mt-4.5">
        {data.map((item, index) => {
          const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
          const color = CATEGORICAL_COLORS[index % CATEGORICAL_COLORS.length];
          return (
            <div key={item.range} className="mb-3.5 last:mb-0">
              <div className="mb-1.5 flex justify-between text-[13px]">
                <span className="text-(--admin-text)">{item.range}</span>
                <span className="font-bold text-(--admin-text)">
                  {item.value.toLocaleString("en-US")}
                  <span className="ml-1 font-medium text-(--admin-text-secondary)">
                    ({pct}%)
                  </span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
