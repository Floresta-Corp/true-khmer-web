import { motion } from "motion/react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { AgeItem } from "../types";
import {
  TOOLTIP_STYLE,
  TOOLTIP_CURSOR,
  GRID_COLOR,
  TEXT_SECONDARY,
} from "../types";
import { useChartReady } from "./use-chart-ready";

interface AgeGroupsChartProps {
  data: AgeItem[];
}

export function AgeGroupsChart({ data }: AgeGroupsChartProps) {
  const ready = useChartReady();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.7 }}
      className="rounded-xl border border-(--admin-border) dark:bg-slate-900 p-6"
    >
      <h3 className="text-xs font-black text-(--admin-text) uppercase tracking-widest mb-5">
        Age Groups
      </h3>
      <div className="h-55 w-full">
        {ready && (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={data} layout="vertical">
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke={GRID_COLOR}
              />
              <XAxis type="number" hide />
              <YAxis
                dataKey="range"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 700, fill: TEXT_SECONDARY }}
                width={40}
              />
              <Tooltip cursor={TOOLTIP_CURSOR} contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
