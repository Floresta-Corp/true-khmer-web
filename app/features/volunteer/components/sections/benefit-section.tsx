import { Award, CheckCircle2 } from "lucide-react";
import type { OpportunityDetail } from "~/features/volunteer/types/opportunities";

const defaultBenefits = [
  "Hands-on mentorship from conservation experts",
  "Field certification for heritage preservation support",
  "Networking with researchers and local cultural teams",
  "Direct contribution to Cambodia's digital heritage archive",
];

interface BenefitsSectionProps {
  volunteer: OpportunityDetail;
  compact?: boolean;
  hideIcon?: boolean;
}

export default function BenefitsSection({
  volunteer,
  compact = false,
  hideIcon = false,
}: BenefitsSectionProps) {
  const benefits = volunteer?.benefits?.length
    ? volunteer.benefits
    : defaultBenefits;
  if (compact) {
    return (
      <div>
        <h2 className="mb-3.5 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          {!hideIcon && (
            <span className="mr-2 inline-block align-middle">
              <Award className="size-[17.5px] text-[#2f6fe4]" />
            </span>
          )}
          Benefits
        </h2>
        <div className="grid gap-4 md:grid-cols-1">
          {benefits.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 text-gray-600 dark:text-slate-300"
            >
              <CheckCircle2 className="mt-0.5 size-[17.5px] shrink-0 text-[#009966]" />
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <article className="rounded-[14px] border border-[#e1e7ef] bg-white p-8">
      <h2 className="flex items-center gap-2.5 text-lg font-semibold tracking-[-0.44px] text-[#030213]">
        {!hideIcon && <Award className="size-[17.5px] text-[#2f6fe4]" />}
        Volunteer Benefits
      </h2>
      <ul className="mt-5 space-y-3.5">
        {benefits.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-sm leading-[22.75px] font-medium text-[#4a5565]"
          >
            <CheckCircle2 className="mt-0.5 size-[17.5px] shrink-0 text-[#009966]" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
