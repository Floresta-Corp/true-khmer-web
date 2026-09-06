import { Award, BookOpenCheck, Download, GraduationCap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import type { CertificateKind } from "~/features/course-builder/types";

/**
 * Each option's headline and blurb come from the design's own detail panel; the
 * tag under them, and the three steps beside the preview, are inferred — the
 * design computes those lists in a script past the 256 KiB fetch cap.
 */
interface CertificateOption {
  value: CertificateKind;
  label: string;
  kicker: string;
  desc: string;
  tag: string;
  steps: Array<{ icon: LucideIcon; title: string; desc: string }>;
}

const OPTIONS: CertificateOption[] = [
  {
    value: "participation",
    label: "Certificate of Participation",
    kicker: "OF PARTICIPATION",
    desc: "Awarded when learners complete all required lessons.",
    tag: "No quiz required",
    steps: [
      {
        icon: BookOpenCheck,
        title: "Finish the lessons",
        desc: "Every required lesson has to be marked complete.",
      },
      {
        icon: Award,
        title: "Issued automatically",
        desc: "The certificate is granted as soon as the last lesson is done.",
      },
      {
        icon: Download,
        title: "Theirs to keep",
        desc: "Learners can download and share it from their profile.",
      },
    ],
  },
  {
    value: "completion",
    label: "Certificate of Completion",
    kicker: "OF COMPLETION",
    desc: "Awarded when learners complete all required lessons and pass the quiz.",
    tag: "Quiz required",
    steps: [
      {
        icon: BookOpenCheck,
        title: "Finish the lessons",
        desc: "Every required lesson has to be marked complete.",
      },
      {
        icon: GraduationCap,
        title: "Pass the quiz",
        desc: "Learners need at least the passing score you set.",
      },
      {
        icon: Award,
        title: "Issued automatically",
        desc: "The certificate is granted once both are done.",
      },
    ],
  },
];

interface CertificateStepProps {
  value: CertificateKind;
  onChange: (value: CertificateKind) => void;
}

export function CertificateStep({ value, onChange }: CertificateStepProps) {
  const selected =
    OPTIONS.find((option) => option.value === value) ?? OPTIONS[1];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {OPTIONS.map((option) => {
          const active = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={cn(
                "cursor-pointer rounded-xl border p-5 text-left transition-colors",
                active
                  ? "border-[#1C5DD4] bg-[#EFF4FE]"
                  : "border-[#E5E7EB] bg-white hover:border-[#C9D6F2]",
              )}
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="text-[18px] font-bold text-[#1A1A2E]">
                  {option.label}
                </div>
                <span
                  aria-hidden
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                    active ? "border-[#1C5DD4]" : "border-[#C9CBD4]",
                  )}
                >
                  {active && (
                    <span className="size-2.5 rounded-full bg-[#1C5DD4]" />
                  )}
                </span>
              </div>

              <div className="mb-3.5 text-[13.5px] leading-[1.5] text-[#9A9AB0]">
                {option.desc}
              </div>
              <span
                className={cn(
                  "inline-block rounded-full px-3 py-1.5 text-[11px] font-bold",
                  active
                    ? "bg-[#D5E2FA] text-[#1C5DD4]"
                    : "bg-[#F5F5F5] text-[#777777]",
                )}
              >
                {option.tag}
              </span>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-[#E5E7EB] p-6">
        <div className="flex flex-wrap items-start gap-7">
          <div className="w-[220px] shrink-0 rounded-lg border border-[#E5E7EB] bg-white px-3.5 py-[18px] text-center">
            <div className="text-xs font-extrabold tracking-[0.08em] text-[#1A1A2E]">
              CERTIFICATE
            </div>
            <div className="mb-4 text-[8.5px] font-semibold tracking-[0.12em] text-[#9A9AB0]">
              {selected.kicker}
            </div>
            <div className="mx-5 mb-3 h-px bg-[#E5E7EB]" />
            <div className="mb-4 text-xs font-bold text-[#1A1A2E]">
              Recipient Name
            </div>
            <div className="mx-auto mb-2.5 size-6 rounded-full bg-[#D5E2FA]" />
            <div className="flex justify-between gap-3.5">
              <div className="mt-2 h-px flex-1 bg-[#E5E7EB]" />
              <div className="mt-2 h-px flex-1 bg-[#E5E7EB]" />
            </div>
          </div>

          <div className="min-w-[260px] flex-1">
            <h3 className="mb-1.5 text-base font-bold text-[#1A1A2E]">
              {selected.label}
            </h3>
            <p className="mb-[22px] text-[13.5px] text-[#9A9AB0]">
              {selected.desc}
            </p>

            <div className="flex flex-wrap gap-6 border-t border-[#E5E7EB] pt-5">
              {selected.steps.map((step) => (
                <div
                  key={step.title}
                  className="flex min-w-[150px] flex-1 gap-3"
                >
                  <span
                    aria-hidden
                    className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-[#D5E2FA] text-[#1C5DD4]"
                  >
                    <step.icon size={17} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-bold text-[#1A1A2E]">
                      {step.title}
                    </div>
                    <div className="mt-0.5 text-[12.5px] leading-[1.4] text-[#9A9AB0]">
                      {step.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
