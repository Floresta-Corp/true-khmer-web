import { motion } from "motion/react";
import type { GenderItem } from "../types";

interface GenderBreakdownChartProps {
  data: GenderItem[];
}

function buildConicGradient(data: GenderItem[], total: number) {
  if (total <= 0) return "var(--admin-card-muted)";
  let acc = 0;
  const stops = data.map((item) => {
    const start = (acc / total) * 100;
    acc += item.value;
    const end = (acc / total) * 100;
    return `${item.color} ${start}% ${end}%`;
  });
  return `conic-gradient(${stops.join(",")})`;
}

export function GenderBreakdownChart({ data }: GenderBreakdownChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const gradient = buildConicGradient(data, total);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="rounded-2xl border border-(--admin-border) bg-(--admin-card-bg) p-6"
    >
      <h3 className="text-base font-bold text-(--admin-text)">
        Gender breakdown
      </h3>
      <div className="mt-4.5 flex items-center gap-5">
        <div
          className="relative h-24 w-24 shrink-0 rounded-full"
          style={{ background: gradient }}
        >
          <div className="absolute inset-4.75 rounded-full bg-(--admin-card-bg)" />
        </div>
        <div className="flex flex-1 flex-col gap-3">
          {data.map((item) => {
            const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
            return (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ background: item.color }}
                />
                <span className="flex-1 text-[13px] text-(--admin-text)">
                  {item.name}
                </span>
                <span className="text-[13px] font-bold text-(--admin-text)">
                  {item.value.toLocaleString("en-US")}
                  <span className="ml-1 font-medium text-(--admin-text-secondary)">
                    ({pct}%)
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
