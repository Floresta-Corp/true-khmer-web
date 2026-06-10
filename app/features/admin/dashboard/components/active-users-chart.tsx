import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { ActiveUserPoint } from "../admin-dashboard";
import { TOOLTIP_STYLE, GRID_COLOR, TEXT_MUTED } from "../admin-dashboard";

interface ActiveUsersChartProps {
  data: ActiveUserPoint[];
}

export function ActiveUsersChart({ data }: ActiveUsersChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="rounded-xl border border-[#1c2235] bg-[#0f1422] p-6"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-[15px] font-semibold text-white">Active Users</h3>
          <p className="mt-1 text-xs text-slate-500">Live traffic (24h)</p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          LIVE NOW
        </div>
      </div>
      <div className="h-45">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
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
            <Tooltip
              cursor={{ stroke: "#1c2235", strokeWidth: 1 }}
              contentStyle={TOOLTIP_STYLE}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#areaGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
