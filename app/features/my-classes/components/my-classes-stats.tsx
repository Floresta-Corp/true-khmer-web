import { Award, BookOpen, CheckCircle2, Clock } from "lucide-react";
import { formatDurationLong } from "~/features/my-classes/lib/format";
import type { MyClassesStats } from "~/features/my-classes/types";

export function MyClassesStatCards({ stats }: { stats: MyClassesStats }) {
  const cards = [
    {
      label: "In progress",
      value: stats.inProgress.toLocaleString(),
      icon: BookOpen,
      tint: "bg-[#EFF6FF] text-[#2F6FE4]",
    },
    {
      label: "Completed",
      value: stats.completed.toLocaleString(),
      icon: CheckCircle2,
      tint: "bg-[#EEF9F3] text-[#1FC16B]",
    },
    {
      label: "Time learned",
      value: formatDurationLong(stats.timeLearnedSeconds),
      icon: Clock,
      tint: "bg-[#EFF6FF] text-[#2F6FE4]",
    },
    {
      label: "Earned certificates",
      value: stats.certificates.toLocaleString(),
      icon: Award,
      tint: "bg-[#F3F0FF] text-[#7C5CFC]",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="flex items-center gap-3.5 rounded-2xl border border-[#e2e8f0] bg-white px-5 py-4"
          >
            <span
              className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${card.tint}`}
            >
              <Icon size={19} strokeWidth={2} aria-hidden />
            </span>
            <div className="min-w-0">
              <div className="text-[22px] leading-tight font-bold text-[#1A1A2E]">
                {card.value}
              </div>
              <div className="truncate text-[12.5px] text-[#8A94A6]">
                {card.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
