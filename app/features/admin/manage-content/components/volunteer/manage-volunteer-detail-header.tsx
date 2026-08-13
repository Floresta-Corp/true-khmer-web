import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router";

import type { AdminVolunteerPostDetailResponse } from "~/types/api-client";
import DeleteVolunteerDialog from "./delete-volunteer-dialog";
import SuspendVolunteerDialog from "./suspend-volunteer-dialog";

interface ManageVolunteerDetailHeaderProps {
  opportunity: AdminVolunteerPostDetailResponse;
  isSuspended: boolean;
  isModerating: boolean;
  onSuspend: (opportunityId: string, reason: string) => void;
  onUnsuspend: (opportunityId: string) => void;
  onDelete: (opportunityId: string) => void;
}

export default function ManageVolunteerDetailHeader({
  opportunity,
  isSuspended,
  isModerating,
  onSuspend,
  onUnsuspend,
  onDelete,
}: ManageVolunteerDetailHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Link
        to="/tk-admin/manage-volunteer"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to volunteer management
      </Link>

      <div className="flex items-center gap-2">
        <Link
          to={`/volunteer/detail/${opportunity.id}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
        >
          <ExternalLink size={14} />
          View on site
        </Link>

        <SuspendVolunteerDialog
          opportunityId={opportunity.id}
          opportunityTitle={opportunity.title}
          suspended={isSuspended}
          onSuspend={onSuspend}
          onUnsuspend={onUnsuspend}
          disabled={isModerating}
          withLabel
        />

        <DeleteVolunteerDialog
          opportunityId={opportunity.id}
          opportunityTitle={opportunity.title}
          applicationCount={opportunity.applicationCount}
          onConfirm={onDelete}
          disabled={isModerating}
          withLabel
        />
      </div>
    </div>
  );
}
