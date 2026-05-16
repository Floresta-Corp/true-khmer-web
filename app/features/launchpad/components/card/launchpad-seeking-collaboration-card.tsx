import { Card } from "~/components/ui/card";
import LaunchpadCollaborationCard from "./launchpad-collaboration-card";
import type { LaunchpadDetail } from "~/services/launchpad/types/project";

interface LaunchpadSeekingCollaborationCardProps {
  project: LaunchpadDetail;
}

export default function LaunchpadSeekingCollaborationCard({
  project,
}: LaunchpadSeekingCollaborationCardProps) {
  const collaborationData = project.roles.map((role) => ({
    id: role.id,
    title: role.title,
    details: role.description,
    availableSpot: role.capacity,
  }));

  return (
    <Card className="rounded-2xl border-[#E7ECF3] bg-white p-6">
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
          />
        ))}
      </div>
    </Card>
  );
}
