import { useCallback } from "react";
import { Gift } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router";

import DetailPanel from "~/features/admin/components/detail-panel";
import ModerationHoldNotice from "~/features/admin/components/moderation-hold-notice";
import { useVolunteerModeration } from "../../hooks/use-volunteer-moderation";
import type { manageVolunteerDetailLoader } from "../../services/manage-volunteer-detail.loader";
import ManageVolunteerDetailHeader from "../volunteer/manage-volunteer-detail-header";
import ManageVolunteerDetailHero from "../volunteer/manage-volunteer-detail-hero";
import ManageVolunteerDetailsPanel from "../volunteer/manage-volunteer-details-panel";
import ManageVolunteerOrganizerPanel from "../volunteer/manage-volunteer-organizer-panel";
import ManageVolunteerRolesPanel from "../volunteer/manage-volunteer-roles-panel";

export default function ManageVolunteerDetailPage() {
  const { opportunity } = useLoaderData<typeof manageVolunteerDetailLoader>();
  const navigate = useNavigate();

  const handleDeleted = useCallback(() => {
    navigate("/tk-admin/manage-volunteer");
  }, [navigate]);

  const {
    deleteOpportunity,
    suspendOpportunity,
    unsuspendOpportunity,
    isModerating,
  } = useVolunteerModeration({ onDeleted: handleDeleted });

  const isSuspended = opportunity.status === "SUSPENDED";

  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col bg-[#f8fafc] md:h-[calc(100vh-5rem)] dark:bg-slate-950">
      <div className="custom-scrollbar flex-1 overflow-auto p-6">
        <div className="mx-auto w-full max-w-5xl space-y-4">
          <ManageVolunteerDetailHeader
            opportunity={opportunity}
            isSuspended={isSuspended}
            isModerating={isModerating}
            onSuspend={suspendOpportunity}
            onUnsuspend={unsuspendOpportunity}
            onDelete={deleteOpportunity}
          />

          {isSuspended && (
            <ModerationHoldNotice
              noun="opportunity"
              visibility="Only its poster can see it, and nobody can apply or save it."
              reason={opportunity.suspensionReason}
            />
          )}

          <ManageVolunteerDetailHero opportunity={opportunity} />

          <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
            <div className="space-y-4">
              {opportunity.communityImpact && (
                <DetailPanel title="Community impact">
                  <p className="text-sm leading-6 whitespace-pre-line text-slate-600 dark:text-slate-300">
                    {opportunity.communityImpact}
                  </p>
                </DetailPanel>
              )}

              <ManageVolunteerRolesPanel roles={opportunity.roles} />

              {opportunity.benefits.length > 0 && (
                <DetailPanel title="Benefits">
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {opportunity.benefits.map((benefit, index) => (
                      <li
                        key={`benefit-${index}`}
                        className="flex items-start gap-2 text-xs leading-5 text-slate-600 dark:text-slate-300"
                      >
                        <Gift
                          size={13}
                          className="mt-0.5 shrink-0 text-slate-400"
                        />
                        <span className="min-w-0">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </DetailPanel>
              )}
            </div>

            <div className="space-y-4">
              <ManageVolunteerDetailsPanel opportunity={opportunity} />
              <ManageVolunteerOrganizerPanel
                organizer={opportunity.organizer}
              />
            </div>
          </div>

          <div className="pb-2" />
        </div>
      </div>
    </div>
  );
}
