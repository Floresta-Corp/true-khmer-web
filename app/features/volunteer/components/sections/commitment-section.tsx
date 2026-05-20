import type { OpportunityDetail } from "~/services/volunteer/types";

interface CommitmentSectionProps {
  volunteer: OpportunityDetail;
}

export default function CommitmentSection({
  volunteer,
}: CommitmentSectionProps) {
  return (
    <div className="bg-gray-50/50 dark:bg-slate-800/20 rounded-2xl p-6 border border-gray-100 dark:border-slate-800">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight flex items-center gap-2">
        Commitment
      </h2>
      <div className="space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-tight">
            Time Commitment
          </p>
          <p className="text-brand-blue font-bold text-lg">
            {volunteer.commitmentLabel}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-tight">
            Details
          </p>
          <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
            {volunteer.commitmentDescription ||
              "No specific commitment details provided."}
          </p>
        </div>
      </div>
    </div>
  );
}
