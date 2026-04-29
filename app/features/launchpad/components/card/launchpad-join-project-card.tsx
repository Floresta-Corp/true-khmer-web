import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { SelectOption } from "~/components/ui/select-option";
import { Separator } from "~/components/ui/separator";
import type { LaunchpadDetail } from "~/services/launchpad/types/project";
import LaunchpadSubmitApplicationDialog from "../dialog/launchpad-submit-application-dialog";

interface LaunchpadJoinProjectCardProps {
  project: LaunchpadDetail;
}

export default function LaunchpadJoinProjectCard({
  project,
}: LaunchpadJoinProjectCardProps) {
  const roleOptions = useMemo(
    () => project.roles.map((role) => ({ id: role.id, name: role.title })),
    [project.roles],
  );

  const [selectedRoleId, setSelectedRoleId] = useState(
    roleOptions[0]?.id ?? "",
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="rounded-2xl border-[#E7ECF3] bg-white p-5">
      <div className="text-[28px] leading-8.5 font-semibold text-[#0F1729]">
        Join this project
      </div>
      <Separator className="my-4 bg-[#E7ECF3]" />

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#9EACC0]">Seeking</span>
          <span className="font-medium text-[#0F1729]">
            {project.roles.length} roles
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#9EACC0]">Deadline</span>
          <span className="font-medium text-[#0F1729]">
            {formatDate(project.deadline)}
          </span>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <p className="text-sm text-[#334155]">Select role of interest</p>
        <SelectOption
          id="launchpad-role"
          data={roleOptions}
          defaultValue={selectedRoleId}
          onChange={setSelectedRoleId}
          placeholder="Select role"
          triggerClassName="h-10 rounded-lg border border-[#E7ECF3] bg-[#F8FAFC] text-sm"
        />
      </div>

      <LaunchpadSubmitApplicationDialog
        trigger={
          <Button className="mt-5 h-10 w-full rounded-lg bg-[#2F6FE4] text-sm font-semibold text-white hover:bg-[#245cc2]">
            Apply Now
          </Button>
        }
      />
    </Card>
  );
}
