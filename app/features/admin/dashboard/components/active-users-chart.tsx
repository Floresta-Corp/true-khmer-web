import { motion } from "motion/react";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";
import type { ActiveUsersData, ChartPeriod, ChartSeries } from "../types";
import {
  TOOLTIP_STYLE,
  TOOLTIP_CURSOR,
  TEXT_MUTED,
  BRAND_COLOR,
  CHART_PERIOD_OPTIONS,
} from "../types";
import { RangeSelect } from "./range-select";
import { useChartReady } from "./use-chart-ready";

interface ActiveUsersChartProps {
  series: ChartSeries<ActiveUsersData>;
}

export function ActiveUsersChart({ series }: ActiveUsersChartProps) {
  const ready = useChartReady();
  const { data: seriesData, period, loading, setPeriod } = series;
  const data = seriesData.trend.map((p) => ({ time: p.label, value: p.count }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="rounded-2xl border border-(--admin-border) bg-(--admin-card-bg) p-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-(--admin-text)">Active users</h3>
        <RangeSelect
          options={CHART_PERIOD_OPTIONS}
          value={period}
          onChange={(id) => setPeriod(id as ChartPeriod)}
          disabled={loading}
        />
      </div>
      <div
        className={`mt-6 h-45 transition-opacity ${loading ? "opacity-50" : ""}`}
      >
        {ready && (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart
              data={data}
              margin={{ top: 4, right: 4, left: 4, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="activeUsersFill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={BRAND_COLOR}
                    stopOpacity={0.22}
                  />
                  <stop offset="100%" stopColor={BRAND_COLOR} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: TEXT_MUTED, fontWeight: 500 }}
              />
              <Tooltip cursor={TOOLTIP_CURSOR} contentStyle={TOOLTIP_STYLE} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={BRAND_COLOR}
                strokeWidth={2}
                fill="url(#activeUsersFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
