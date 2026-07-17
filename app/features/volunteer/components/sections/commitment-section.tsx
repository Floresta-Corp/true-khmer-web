import type { OpportunityDetail } from "~/features/volunteer/types";

interface CommitmentSectionProps {
  volunteer: OpportunityDetail;
}

export default function CommitmentSection({
  volunteer,
}: CommitmentSectionProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 dark:border-slate-800 dark:bg-slate-800/20">
      <h2 className="mb-2.5 flex items-center gap-2 text-lg font-bold tracking-tight text-gray-900 md:text-xl dark:text-white">
        Commitment
      </h2>
      <div className="space-y-6">
        <div className="space-y-1">
          <p className="text-xs leading-tight font-bold tracking-widest text-gray-400 uppercase">
            Time Commitment
          </p>
          <p className="text-brand-blue text-base font-bold md:text-lg">
            {volunteer.commitmentLabel}
          </p>
        </div>
        <div className="space-y-1">
          <p className="-mt-3 text-xs leading-tight font-bold tracking-widest text-gray-400 uppercase">
            Details
          </p>
          <p className="leading-relaxed text-gray-600 dark:text-slate-400">
            {volunteer.commitmentDescription ||
              "No specific commitment details provided."}
          </p>
        </div>
      </div>
    </div>
  );
}
