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
import type { AgeItem } from "../admin-dashboard";
import { TOOLTIP_STYLE, GRID_COLOR, TEXT_SECONDARY } from "../admin-dashboard";
import { useState } from "react";

interface AgeGroupsChartProps {
  data: AgeItem[];
}

export function AgeGroupsChart({ data }: AgeGroupsChartProps) {
  const [isDark] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.7 }}
      className="rounded-xl border border-(--admin-border)  dark:bg-slate-900 p-6"
    >
      <h3 className="text-xs font-black text-(--admin-text) uppercase tracking-widest mb-5">
        Age Groups
      </h3>
      <div className="h-55 w-full">
        <ResponsiveContainer width="100%" height="100%">
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
            <Tooltip
              cursor={{ fill: "var(--admin-card-muted)", radius: 10 }}
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                fontSize: "11px",
              }}
            />
            <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
