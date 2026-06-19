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
import { TrendingUp } from "lucide-react";
import {
  TOOLTIP_STYLE,
  GRID_COLOR,
  TEXT_MUTED,
  type ChartBarItem,
} from "../admin-dashboard";
import { useState } from "react";

interface RegistrationsChartProps {
  data: ChartBarItem[];
}

export function RegistrationsChart({ data }: RegistrationsChartProps) {
  const [isDark] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="rounded-xl border border-(--admin-border)  dark:bg-slate-900 p-6"
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
        <div className="flex items-center gap-1 text-[12px] font-semibold text-emerald-600 dark:text-emerald-400">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>+18%</span>
        </div>
      </div>
      <div className="h-45">
        <ResponsiveContainer width="100%" height="100%">
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
              cursor={{ fill: "var(--admin-card-muted)", radius: 10 }}
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                fontSize: "11px",
              }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.highlight ? "#3b82f6" : "var(--admin-text-muted)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
