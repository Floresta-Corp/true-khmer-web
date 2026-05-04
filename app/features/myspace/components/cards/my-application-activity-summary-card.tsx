import {
  Archive,
  ArrowRightCircle,
  CircleCheck,
  Loader,
  Rocket,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

const summaryData = [
  { label: "PENDING", value: 2 },
  { label: "ACTIVE", value: 12 },
  { label: "COMPLETED", value: 8 },
  { label: "ARCHIVED", value: 2 },
];

const StatusIcon = (label: string) => {
  switch (label) {
    case "PENDING":
      return (
        <div className="text-[#8B5CF6] bg-[#F3E8FF] p-2.75 rounded-xl">
          <Loader size={22} />
        </div>
      );
    case "ACTIVE":
      return (
        <div className="text-[#2563EB] bg-[#DBEAFE] p-2.75 rounded-xl">
          <Rocket size={22} />
        </div>
      );

    case "COMPLETED":
      return (
        <div className="text-[#15803D] bg-[#DCFCE7] p-2.75 rounded-xl">
          <CircleCheck size={22} />
        </div>
      );
    case "ARCHIVED":
      return (
        <div className="text-[#64748B] bg-gray-200 p-2.75 rounded-xl">
          <Archive size={22} />
        </div>
      );
    default:
      return (
        <div className="text-slate-600 bg-slate-300 p-2.75 rounded-xl">
          <ArrowRightCircle size={22} />
        </div>
      );
  }
};

export default function MyApplicationActivitySummaryCard() {
  return (
    <Card className="shadow-none rounded-2xl">
      <CardHeader className="font-bold text-[20px]">
        Activity Summary
      </CardHeader>
      <CardContent className="flex gap-4 flex-col">
        {summaryData.map((v) => {
          return (
            <div
              key={v.label}
              className="bg-slate-100 p-4 flex items-center gap-3 rounded-[16px]"
            >
              {StatusIcon(v.label)}
              <div className="font-bold">
                <p>{v.label}</p>
                <p>{v.value >= 10 ? v.value : `0${v.value}`}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
