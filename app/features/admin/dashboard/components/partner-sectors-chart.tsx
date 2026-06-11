import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import type { PartnerSector } from "../admin-dashboard";
import { TOOLTIP_STYLE, TEXT_SECONDARY } from "../admin-dashboard";

interface PartnerSectorsChartProps {
  data: PartnerSector[];
}

export function PartnerSectorsChart({ data }: PartnerSectorsChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.8 }}
      className="rounded-xl border border-(--admin-border) bg-(--admin-card-bg) p-6"
    >
      <h3 className="text-xs font-black text-(--admin-text) uppercase tracking-widest mb-5">
        Partner Sectors
      </h3>
      <div className="h-55 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend
              iconType="square"
              wrapperStyle={{ fontSize: "11px", color: TEXT_SECONDARY }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
