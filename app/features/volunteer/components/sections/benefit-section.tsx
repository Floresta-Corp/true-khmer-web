import { Award, CheckCircle2 } from "lucide-react";
import type { Opportunity } from "~/services/volunteer/types/opportunities";

const defaultBenefits = [
  "Hands-on mentorship from conservation experts",
  "Field certification for heritage preservation support",
  "Networking with researchers and local cultural teams",
  "Direct contribution to Cambodia's digital heritage archive",
];

interface BenefitsSectionProps {
  volunteer: Opportunity;
}

export default function BenefitsSection({ volunteer }: BenefitsSectionProps) {
  const benefits = volunteer?.benefits?.length
    ? volunteer.benefits
    : defaultBenefits;

  return (
    <article className="rounded-[14px] border border-[#e1e7ef] bg-white p-8">
      <h2 className="flex items-center gap-2.5 text-lg font-semibold tracking-[-0.44px] text-[#030213]">
        <Award className="size-[17.5px] text-[#2f6fe4]" />
        Volunteer Benefits
      </h2>
      <ul className="mt-5 space-y-3.5">
        {benefits.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-sm font-medium leading-[22.75px] text-[#4a5565]"
          >
            <CheckCircle2 className="mt-0.5 size-[17.5px] shrink-0 text-[#009966]" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
