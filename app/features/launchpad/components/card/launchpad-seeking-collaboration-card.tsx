import { Card } from "~/components/ui/card";
import LaunchpadCollaborationCard from "./launchpad-collaboration-card";
import type { LaunchpadDetail } from "~/features/launchpad/types";

interface LaunchpadSeekingCollaborationCardProps {
  project: LaunchpadDetail;
  hideApplyButton?: boolean;
}

export default function LaunchpadSeekingCollaborationCard({
  project,
  hideApplyButton,
}: LaunchpadSeekingCollaborationCardProps) {
  const collaborationData = project.roles.map((role) => ({
    id: role.id,
    title: role.title,
    details: role.description,
    availableSpot: role.capacity,
  }));

  return (
    <Card className="rounded-3xl border-[#E7ECF3] bg-white p-6 shadow-none">
      <div className="mb-5 text-xl font-semibold text-[#0F1729]">
        Seeking Collaboration
      </div>
      <div className="grid grid-cols-1 gap-3.5">
        {collaborationData.map((v) => (
          <LaunchpadCollaborationCard
            key={v.id}
            data={v}
            launchpadId={project.id}
            launchpadName={project.name}
            roles={project.roles}
            hideApplyButton={hideApplyButton}
          />
        ))}
      </div>
    </Card>
  );
}
