import {
  BadgeCheck,
  Ban,
  CheckCircle2,
  Search,
  Send,
  Star,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import type { Timeline } from "~/services/myspace/types";

export interface StatusTimelineProps {
  activeStep: number;
  appliedAt?: string | null;
  timeline?: Partial<Timeline>;
  inactive?: boolean;
  status?: string;
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

export function StatusTimeline({
  activeStep,
  appliedAt,
  timeline,
  inactive,
  status,
}: StatusTimelineProps) {
  const prefersReducedMotion = useReducedMotion();
  const normalizedStatus = status?.toUpperCase() ?? "";
  const isWithdrawn = normalizedStatus === "WITHDRAWN";
  const hasEvaluationStep = Boolean(timeline?.underReview);
  const wasApprovedBeforeTerminal = Boolean(timeline?.approved);
  const terminalLabel = isWithdrawn ? "Withdrawn" : "Declined";
  const terminalSubtext = isWithdrawn
    ? "Withdrawn by you"
    : timeline?.declined?.by === "SYSTEM"
      ? "Position filled"
      : timeline?.declined?.by === "POSTER"
        ? "Declined by organizer"
        : "No longer active";
  const baseSteps = [
    {
      label: "Submitted",
      subtext: "Successfully registered",
      date: formatDate(timeline?.submitted ?? appliedAt),
      icon: Send,
    },
    {
      label: "Evaluation",
      subtext: inactive ? "Processed" : "Evaluating profile",
      date: formatDate(timeline?.underReview),
      icon: Search,
    },
    {
      label: "Approved",
      subtext: "Approved by organizer",
      date: formatDate(timeline?.approved),
      icon: BadgeCheck,
    },
    {
      label: "Acceptance",
      subtext: "Participation confirmed",
      date: formatDate(timeline?.confirmed),
      icon: CheckCircle2,
    },
    {
      label: "Completed",
      subtext: "Rewards issued",
      date: formatDate(timeline?.completed),
      icon: Star,
    },
  ];
  const terminalStep = {
    label: terminalLabel,
    subtext: terminalSubtext,
    date: formatDate(timeline?.declined?.at),
    icon: Ban,
  };
  const terminalSteps = wasApprovedBeforeTerminal
    ? [
        baseSteps[0],
        {
          ...baseSteps[1],
          subtext: "Assessed & verified",
        },
        baseSteps[2],
        terminalStep,
      ]
    : hasEvaluationStep
      ? [
          baseSteps[0],
          {
            ...baseSteps[1],
            subtext: "Processed",
          },
          terminalStep,
        ]
    : [
        baseSteps[0],
        terminalStep,
      ];
  const steps = inactive ? terminalSteps : baseSteps;
  const clampedActiveStep = inactive
    ? steps.length
    : Math.max(1, Math.min(activeStep, steps.length));
  const progress = Math.max(
    0,
    Math.min((clampedActiveStep - 1) / (steps.length - 1), 1),
  );
  const trackInsetClass =
    steps.length === 3
      ? "left-[16.67%] right-[16.67%]"
      : steps.length === 2
        ? "left-[25%] right-[25%]"
      : steps.length === 4
        ? "left-[12.5%] right-[12.5%]"
      : "left-[10%] right-[10%]";

  return (
    <Card className="rounded-3xl border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-slate-900">
      <CardContent className="p-6 sm:p-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Application Progress
        </h2>

        <div className="relative mt-8">
          <div
            className={cn(
              "absolute top-6 hidden h-0.5 rounded-full bg-slate-100 md:block dark:bg-slate-800",
              trackInsetClass,
            )}
          />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ transformOrigin: "left" }}
            className={cn(
              "absolute top-6 hidden h-0.5 rounded-full md:block",
              trackInsetClass,
              inactive
                ? "bg-gradient-to-r from-blue-500 via-emerald-500 to-red-300"
                : "bg-gradient-to-r from-blue-500 to-green-500",
            )}
          />

          <div className="relative z-10 flex flex-col items-stretch justify-between gap-6 md:flex-row md:gap-4">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const StepIcon = step.icon;
              const isComplete = inactive
                ? stepNumber < steps.length
                : stepNumber < clampedActiveStep;
              const isActive = !inactive && stepNumber === clampedActiveStep;
              const isInactiveStop = inactive && stepNumber === steps.length;

              return (
                <div
                  key={step.label}
                  className="flex flex-1 items-center gap-4 text-left md:flex-col md:text-center"
                >
                  <div className="relative shrink-0">
                    {isActive ? (
                      <div className="absolute inset-0 rounded-full bg-blue-400/20 motion-safe:animate-ping" />
                    ) : null}
                    <div
                      className={cn(
                        "relative flex size-12 items-center justify-center rounded-full border-2 transition-colors",
                        isInactiveStop
                          ? "border-red-200 bg-red-50 text-red-500"
                          : isComplete
                            ? "border-blue-600 bg-blue-600 text-white"
                            : isActive
                              ? "border-blue-500 bg-blue-50 text-blue-600"
                              : "border-slate-200 bg-white text-slate-400 dark:border-slate-800 dark:bg-slate-900",
                      )}
                    >
                      <StepIcon className="size-4.5" />
                    </div>
                    <div className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full border border-white bg-slate-100 text-[9px] font-black text-slate-500 dark:border-slate-900 dark:bg-slate-800">
                      {stepNumber}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "text-xs font-bold",
                        isComplete
                          ? "text-slate-800 dark:text-slate-200"
                          : isActive
                            ? "text-blue-600 dark:text-blue-400"
                            : isInactiveStop
                              ? "text-red-500"
                              : "text-slate-400",
                      )}
                    >
                      {step.label}
                    </p>
                    <p className="mt-1 text-[10px] leading-normal text-slate-400 dark:text-slate-500">
                      {step.subtext}
                    </p>
                    <p className="mt-1 text-[10px] italic text-slate-400 dark:text-slate-500">
                      {step.date}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
