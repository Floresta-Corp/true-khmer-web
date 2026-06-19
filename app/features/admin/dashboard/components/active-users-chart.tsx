import { motion } from "motion/react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { ActiveUserPoint } from "../admin-dashboard";
import {
  TOOLTIP_STYLE,
  TOOLTIP_CURSOR,
  GRID_COLOR,
  TEXT_MUTED,
} from "../admin-dashboard";
import { useChartReady } from "./use-chart-ready";

interface ActiveUsersChartProps {
  data: ActiveUserPoint[];
  liveNow: boolean;
}

export function ActiveUsersChart({ data, liveNow }: ActiveUsersChartProps) {
  const ready = useChartReady();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="rounded-xl border border-(--admin-border) bg-(--admin-card-bg) p-6"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-[15px] font-semibold text-(--admin-text)">
            Active Users
          </h3>
          <p className="mt-1 text-xs text-(--admin-text-muted)">
            Live traffic (24h)
          </p>
        </div>
        {liveNow && (
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            LIVE NOW
          </div>
        )}
      </div>
      <div className="h-45">
        {ready && (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={GRID_COLOR}
              />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: TEXT_MUTED, fontWeight: 600 }}
              />
              <Tooltip cursor={TOOLTIP_CURSOR} contentStyle={TOOLTIP_STYLE} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#areaGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
