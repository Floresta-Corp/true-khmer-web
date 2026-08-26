import { Link } from "react-router";
import { Card, CardTitle } from "~/components/ui/card";
import { BarChart3 } from "lucide-react";

const chartBars = [
  { height: 19.19 },
  { height: 38.39 },
  { height: 28.8 },
  { height: 57.59 },
  { height: 43.19 },
  { height: 24, opacity: 40 },
  { height: 14.39, opacity: 20 },
];

export function PointsChartCard() {
  return (
    <Card className="relative overflow-clip rounded-3xl bg-white p-8">
      <div className="flex w-full items-center justify-between pb-8">
        <CardTitle className="text-[20px] leading-7 font-bold text-[#2c2f31]">
          Points Earned Over Time
        </CardTitle>
        <div className="flex items-start">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f8fafc]">
            <BarChart3 className="h-[11.667px] w-[10.5px] shrink-0 text-[#64748b]" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-dashed border-[#e2e8f0] bg-[#f8fafc] px-0.5 py-0.5">
        <div className="flex h-64 flex-col items-center justify-center">
          <div className="flex h-30 flex-col items-center justify-center pb-6">
            <div className="flex h-24 items-end gap-3">
              {chartBars.map((bar, index) => (
                <div
                  key={index}
                  className="w-8 rounded-t-lg bg-[#e2e8f0]"
                  style={{
                    height: bar.height,
                    opacity: bar.opacity ? bar.opacity / 100 : 1,
                  }}
                />
              ))}
            </div>
          </div>

          <p className="pb-4 text-[16px] leading-6 text-[#64748b]">
            Your impact will appear here
          </p>

          <Link
            to="#"
            className="inline-flex items-center justify-center rounded-full bg-[#eff6ff] px-6 py-2 text-[14px] leading-5 font-semibold text-[#2563eb]"
          >
            Participate in events
          </Link>
        </div>
      </div>
    </Card>
  );
}
