import { Archive, CheckCircle2, Clock3, Zap } from "lucide-react";
import { useLoaderData } from "react-router";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import type { loader } from "../../route/my-applications";

const StatusIcon = (label: string) => {
  switch (label) {
    case "PENDING":
      return (
        <div className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-purple-100 text-purple-600 transition-transform group-hover:scale-105">
          <Clock3 size={22} />
        </div>
      );
    case "ACTIVE":
      return (
        <div className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-blue-100 text-blue-600 transition-transform group-hover:scale-105">
          <Zap size={22} />
        </div>
      );

    case "COMPLETED":
      return (
        <div className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-green-100 text-green-600 transition-transform group-hover:scale-105">
          <CheckCircle2 size={22} />
        </div>
      );
    case "ARCHIVED":
    default:
      return (
        <div className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-gray-100 text-gray-500 transition-transform group-hover:scale-105">
          <Archive size={22} />
        </div>
      );
  }
};

export default function MyApplicationActivitySummaryCard() {
  const { myApplication } = useLoaderData<typeof loader>();
  const summary = myApplication.summary;
  const pending = Number(summary.PENDING || 0);
  const active = Number(summary.ACTIVE || 0);
  const completed = Number(summary.COMPLETED || 0);
  const archived = Number(summary.ARCHIVED || 0);

  const summaryData = [
    { label: "PENDING", value: pending },
    { label: "ACTIVE", value: active },
    { label: "COMPLETED", value: completed },
    { label: "ARCHIVED", value: archived },
  ];
  return (
    <Card className="rounded-[32px] border border-[#E0E3E7] bg-white shadow-[0_8px_30px_rgba(60,64,67,0.035)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <CardHeader className="px-6 pt-6 pb-0 text-[18px] font-bold text-[#202124] sm:px-8 sm:pt-8 dark:text-white">
        Activity Summary
      </CardHeader>
      <CardContent className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-1">
        {summaryData.map((v) => {
          return (
            <div
              key={v.label}
              className="group flex min-h-[76px] items-center gap-4 rounded-2xl bg-[#F8F9FA] p-4 transition-all hover:bg-[#F1F3F4] dark:bg-slate-800/50 dark:hover:bg-slate-800"
            >
              {StatusIcon(v.label)}
              <div className="flex flex-col justify-between">
                <p className="text-[10px] font-black tracking-[0.1em] text-[#80868B] uppercase">
                  {v.label}
                </p>
                <span className="text-[20px] leading-tight font-bold text-[#202124] dark:text-white">
                  {v.value >= 10 ? v.value : `0${v.value}`}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
