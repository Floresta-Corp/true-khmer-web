import { motion, useReducedMotion } from "motion/react";
import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";

export interface StatusTimelineProps {
  activeStep: number;
  appliedAt?: string | null;
}

function formatDate(dateString?: string | null) {
  if (!dateString) return "TBD";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const STEPS = [
  { label: "Submitted" },
  { label: "Passed" },
  { label: "Confirmed" },
  { label: "Completed" },
];

export function StatusTimeline({ activeStep, appliedAt }: StatusTimelineProps) {
  const prefersReducedMotion = useReducedMotion();
  const steps = STEPS.map((step, index) => ({
    ...step,
    date:
      index === 0
        ? formatDate(appliedAt)
        : index === 1
          ? "Oct 18, 2023"
          : index === 2
            ? "Pending"
            : "Next Step",
  }));

  const progress = Math.max(0, Math.min((activeStep - 1) / 3, 1));

  return (
    <Card className="rounded-[28px] border-[#E7ECF3] bg-white shadow-none">
      <CardContent className="p-6 sm:p-8">
        <h2 className="text-[22px] font-semibold tracking-tight text-[#182031]">
          Application Status
        </h2>

        <div className="relative mt-8">
          <div className="absolute left-6 right-6 top-5 h-0.5 rounded-full bg-[#D8E3F4]" />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ transformOrigin: "left" }}
            className="absolute left-6 right-6 top-5 h-0.5 rounded-full bg-[#2F6FE4]"
          />

          <div className="relative z-10 grid grid-cols-4 gap-2">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber <= activeStep;

              return (
                <div
                  key={step.label}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className={cn(
                      "flex size-9 items-center justify-center rounded-full border-4 shadow-sm",
                      isActive
                        ? "border-white bg-[#2F6FE4] text-white"
                        : "border-white bg-[#D5DCEC] text-[#94A3B8]",
                    )}
                  >
                    <span className="text-xs font-semibold">{stepNumber}</span>
                  </div>
                  <p
                    className={cn(
                      "mt-3 text-[13px] font-semibold",
                      isActive ? "text-[#1F2937]" : "text-[#94A3B8]",
                    )}
                  >
                    {step.label}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-[12px]",
                      isActive ? "text-[#64748B]" : "text-[#CBD5E1]",
                    )}
                  >
                    {step.date}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
