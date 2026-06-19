import { motion } from "motion/react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import type { GenderItem } from "../admin-dashboard";
import { TOOLTIP_STYLE, TEXT_SECONDARY } from "../admin-dashboard";
import { useState } from "react";

interface GenderBreakdownChartProps {
  data: GenderItem[];
}

export function GenderBreakdownChart({ data }: GenderBreakdownChartProps) {
  const [isDark] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="rounded-xl border border-(--admin-border) dark:bg-slate-900 p-6"
    >
      <h3 className="text-xs font-black text-(--admin-text) uppercase tracking-widest mb-5">
        Gender Breakdown
      </h3>
      <div className="h-55 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
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
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: "11px", color: TEXT_SECONDARY }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
