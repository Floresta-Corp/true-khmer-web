import { motion } from "motion/react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  LabelList,
} from "recharts";
import {
  TOOLTIP_STYLE,
  TOOLTIP_CURSOR,
  TEXT_MUTED,
  TEXT_SECONDARY,
  BRAND_COLOR,
  CHART_PERIOD_OPTIONS,
  type ChartPeriod,
  type ChartSeries,
  type NewRegistrationsData,
} from "../types";
import { RangeSelect } from "./range-select";
import { useChartReady } from "./use-chart-ready";

interface NewSignupsChartProps {
  series: ChartSeries<NewRegistrationsData>;
}

export function NewSignupsChart({ series }: NewSignupsChartProps) {
  const ready = useChartReady();
  const { data: seriesData, period, loading, error, setPeriod } = series;
  const data = seriesData.trend.map((p) => ({ day: p.label, value: p.count }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="rounded-2xl border border-(--admin-border) bg-(--admin-card-bg) p-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-(--admin-text)">New signups</h3>
        <RangeSelect
          options={CHART_PERIOD_OPTIONS}
          value={period}
          onChange={(id) => setPeriod(id as ChartPeriod)}
          disabled={loading}
          label="New signups date range"
        />
      </div>
      <div
        className={`mt-6 h-45 transition-opacity ${loading ? "opacity-50" : ""}`}
      >
        {error ? (
          <p
            role="status"
            className="flex h-full items-center justify-center text-center text-sm text-(--admin-text-secondary)"
          >
            {error}
          </p>
        ) : (
          ready && (
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart
                data={data}
                barCategoryGap="28%"
                margin={{ top: 20, right: 4, left: 4, bottom: 0 }}
              >
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: TEXT_MUTED, fontWeight: 500 }}
                />
                <Tooltip
                  cursor={TOOLTIP_CURSOR}
                  contentStyle={TOOLTIP_STYLE}
                  itemStyle={{ color: "var(--admin-text)" }}
                />
                <Bar dataKey="value" fill={BRAND_COLOR} radius={[6, 6, 0, 0]}>
                  <LabelList
                    dataKey="value"
                    position="top"
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      fill: TEXT_SECONDARY,
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )
        )}
      </div>
    </motion.div>
  );
}
