import { Users } from "lucide-react";
import { Button } from "~/components/ui/button";
import LaunchpadSubmitApplicationDialog from "../dialog/launchpad-submit-application-dialog";

interface CollaborationCardProps {
  data: {
    id: string;
    title: string;
    details: string;
    availableSpot: number;
  };
  launchpadId: string;
  launchpadName?: string;
  roles?: Array<{ id: string; title: string }>;
}

export default function LaunchpadCollaborationCard({
  data,
  launchpadId,
  launchpadName,
  roles = [],
}: CollaborationCardProps) {
  const spotLabel = data.availableSpot === 1 ? "Spot" : "Spots";

  return (
    <div className="flex items-center gap-4 rounded-xl border border-[#EEF2F7] bg-[#F8FAFC] p-4">
      <div className="flex size-10 items-center justify-center rounded-xl bg-[#EAF2FF]">
        <Users className="size-4.25 text-blue-500" />
      </div>
      <div className="flex-1 text-sm">
        <div className="font-semibold text-[#0F1729]">{data.title}</div>
        <p className="line-clamp-1 text-[13px] text-[#94A3B8]">
          {data.details}
        </p>
      </div>
      <div className="text-right min-w-15">
        <div className="text-[#9EACC0] text-xs">Available</div>
        <p className="text-sm text-blue-500 font-semibold">
          {data.availableSpot} {spotLabel}
        </p>
      </div>
      <LaunchpadSubmitApplicationDialog
        launchpadId={launchpadId}
        launchpadName={launchpadName}
        selectedRoleId={data.id}
        roles={roles}
        trigger={
          <Button className="h-8 bg-blue-500 px-4 text-sm font-medium hover:bg-blue-600">
            Apply
          </Button>
        }
      />
    </div>
  );
}
