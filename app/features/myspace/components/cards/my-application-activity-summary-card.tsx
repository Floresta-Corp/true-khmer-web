import {
  Archive,
  ArrowRightCircle,
  CircleCheck,
  Loader,
  Rocket,
} from "lucide-react";
import { useLoaderData } from "react-router";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import type { loader } from "../../routes/my-applications";

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
  const { myApplication } = useLoaderData<typeof loader>();
  const pending =
    Number(myApplication.summary.SUBMITTED) +
    Number(myApplication.summary.UNDER_REVIEW);

  const active =
    Number(myApplication.summary.APPROVED) +
    Number(myApplication.summary.CONFIRMED);
  const summaryData = [
    { label: "PENDING", value: pending },
    { label: "ACTIVE", value: active },
    { label: "COMPLETED", value: myApplication.summary.COMPLETED },
    { label: "ARCHIVED", value: myApplication.summary.WITHDRAWN },
  ];
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
              <div>
                <p className="font-semibold text-[#4D5D73]">{v.label}</p>
                <p className="font-bold">
                  {v.value >= 10 ? v.value : `0${v.value}`}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
