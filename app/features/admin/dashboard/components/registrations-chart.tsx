import { motion } from "motion/react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  TOOLTIP_STYLE,
  TOOLTIP_CURSOR,
  GRID_COLOR,
  TEXT_MUTED,
  type ChartBarItem,
} from "../types";
import { useChartReady } from "./use-chart-ready";

interface RegistrationsChartProps {
  data: ChartBarItem[];
  changePercent: number | null;
}

export function RegistrationsChart({
  data,
  changePercent,
}: RegistrationsChartProps) {
  const ready = useChartReady();
  const hasChange = typeof changePercent === "number";
  const isPositive = (changePercent ?? 0) >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="rounded-xl border border-(--admin-border) dark:bg-slate-900 p-6"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-[15px] font-semibold text-(--admin-text)">
            New Registrations
          </h3>
          <p className="mt-1 text-xs text-(--admin-text-muted)">
            Daily member signup trend
          </p>
        </div>
        {hasChange && (
          <div
            className={`flex items-center gap-1 text-[12px] font-semibold ${
              isPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            <span>
              {isPositive ? "+" : ""}
              {changePercent}%
            </span>
          </div>
        )}
      </div>
      <div className="h-45">
        {ready && (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={data} barCategoryGap="20%">
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={GRID_COLOR}
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: TEXT_MUTED, fontWeight: 600 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: TEXT_MUTED, fontWeight: 600 }}
              />
              <Tooltip
                cursor={TOOLTIP_CURSOR}
                contentStyle={TOOLTIP_STYLE}
                itemStyle={{ color: "var(--admin-text)" }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      entry.highlight ? "#3b82f6" : "var(--admin-text-muted)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
