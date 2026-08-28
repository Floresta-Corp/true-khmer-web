import { Check, X } from "lucide-react";
import { cn } from "~/lib/utils";
import type { ReviewStage } from "~/features/course-manage/types";
import { MANAGE_CARD } from "./overview/course-kpi-cards";

/** The submission pipeline rail: a dot per stage joined by connector lines. */
function StageRail({ stages }: { stages: ReviewStage[] }) {
  return (
    <>
      <div className="flex items-center">
        {stages.map((stage, index) => {
          const done = stage.state === "done";
          const rejected = stage.state === "rejected";
          const current = stage.state === "current";

          return (
            <div key={stage.title} className="flex min-w-0 flex-1 items-center">
              <div
                className={cn(
                  "h-0.5 flex-1",
                  index === 0 ? "bg-transparent" : "bg-[#E5E7EB]",
                )}
              />
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border-2",
                  done && "border-[#1FC16B] bg-[#1FC16B] text-white",
                  rejected && "border-[#FB3748] bg-[#FB3748] text-white",
                  current && "border-[#1C5DD4] bg-white text-[#1C5DD4]",
                  stage.state === "todo" &&
                    "border-[#E5E7EB] bg-white text-[#9A9AB0]",
                )}
              >
                {done && <Check size={14} strokeWidth={3} aria-hidden />}
                {rejected && <X size={14} strokeWidth={3} aria-hidden />}
                {current && (
                  <span
                    aria-hidden
                    className="size-2 rounded-full bg-[#1C5DD4]"
                  />
                )}
              </span>
              <div
                className={cn(
                  "h-0.5 flex-1",
                  index === stages.length - 1
                    ? "bg-transparent"
                    : "bg-[#E5E7EB]",
                )}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-2.5 flex items-start">
        {stages.map((stage) => (
          <div key={stage.title} className="min-w-0 flex-1 px-1 text-center">
            <div
              className={cn(
                "text-[13px] font-semibold",
                stage.state === "todo" ? "text-[#9A9AB0]" : "text-[#1A1A2E]",
              )}
            >
              {stage.title}
            </div>
            <div className="mt-1 text-xs text-[#9A9AB0]">{stage.timestamp}</div>
          </div>
        ))}
      </div>
    </>
  );
}

interface ReviewStatusCardProps {
  stages: ReviewStage[];
  status: string;
  rejectionNote: string | null;
  className?: string;
}

/**
 * Where a submission has got to. The design shows this on Overview as well as
 * on the Review tab — its flag is `showOverviewReviewStatus` — so a creator
 * sees the outcome without going looking for it.
 */
export function ReviewStatusCard({
  stages,
  status,
  rejectionNote,
  className,
}: ReviewStatusCardProps) {
  return (
    <div className={cn(MANAGE_CARD, "px-[30px] pt-7 pb-8", className)}>
      <StageRail stages={stages} />

      {status === "PENDING" && (
        <p className="mt-7 rounded-[10px] bg-[#EFF4FE] px-[18px] py-4 text-sm leading-normal text-[#333333]">
          Your course is with the review team. Most reviews finish within three
          working days.
        </p>
      )}

      {rejectionNote && (
        <div className="mt-7 rounded-[10px] border border-[#DC2626]/[0.18] bg-[#DC2626]/[0.06] px-5 py-[18px]">
          <p className="mb-1.5 text-sm font-bold text-[#FB3748]">
            Not approved
          </p>
          <p className="text-sm leading-[1.6] text-[#333333]">
            Reason: {rejectionNote}
          </p>
        </div>
      )}
    </div>
  );
}
