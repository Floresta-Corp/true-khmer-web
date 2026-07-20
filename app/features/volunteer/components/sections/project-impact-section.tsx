import { Target } from "lucide-react";
import type { OpportunityDetail } from "~/features/volunteer/types/opportunities";

interface CommunityImpactSectionProps {
  volunteer: OpportunityDetail;
  compact?: boolean;
  hideIcon?: boolean;
}

export default function CommunityImpactSection({
  volunteer,
  compact = false,
  hideIcon = false,
}: CommunityImpactSectionProps) {
  const content = (
    <p className="leading-relaxed text-gray-600 dark:text-slate-400">
      {volunteer?.communityImpact}
    </p>
  );

  if (compact) {
    return (
      <div>
        <h2 className="mb-2.5 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          {!hideIcon && (
            <span className="mr-2 inline-block align-middle">
              <Target className="size-[17.5px] text-[#2f6fe4]" />
            </span>
          )}
          Community Impact
        </h2>
        {content}
      </div>
    );
  }

  return (
    <article className="rounded-[14px] border border-[#e1e7ef] bg-white p-8">
      <h2 className="flex items-center gap-2.5 text-lg font-semibold tracking-[-0.44px] text-[#030213]">
        {!hideIcon && <Target className="size-[17.5px] text-[#2f6fe4]" />}
        Community Impact
      </h2>
      {content}
    </article>
  );
}
