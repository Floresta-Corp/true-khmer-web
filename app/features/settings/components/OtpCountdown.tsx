import { Clock } from "lucide-react";
import { cn } from "~/lib/utils";

const WARNING_MS = 30_000;

function formatRemainingTime(ms: number) {
  const totalSeconds = Math.max(Math.ceil(ms / 1000), 0);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export function OtpCountdown({
  remainingMs,
  totalMs,
}: {
  remainingMs: number;
  totalMs: number;
}) {
  const isExpired = remainingMs <= 0;
  const isWarning = !isExpired && remainingMs <= WARNING_MS;
  const percent = totalMs > 0 ? (remainingMs / totalMs) * 100 : 0;

  return (
    <div
      className={cn(
        "space-y-2 rounded-lg border px-3 py-2.5",
        isExpired || isWarning
          ? "border-red-200 bg-red-50"
          : "border-[#DBEAFE] bg-[#EFF6FF]",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={cn(
            "flex items-center gap-2 text-sm font-medium",
            isExpired || isWarning ? "text-red-600" : "text-[#1E40AF]",
          )}
        >
          <Clock className="size-4" />
          {isExpired
            ? "This code can no longer be used. Send a new code."
            : "Code expires in"}
        </span>
        {isExpired ? null : (
          <span
            role="timer"
            className={cn(
              "text-lg font-bold tabular-nums",
              isWarning ? "text-red-600" : "text-[#1C5DD4]",
            )}
          >
            {formatRemainingTime(remainingMs)}
          </span>
        )}
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-white/80">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-1000 ease-linear",
            isExpired || isWarning ? "bg-red-500" : "bg-[#2F6FE4]",
          )}
          style={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}
