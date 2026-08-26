import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import LaunchpadSubmitApplicationDialog from "../dialog/launchpad-submit-application-dialog";
import { useLaunchpadSelectedRoles } from "../../../../stores/selected-launchpad-roles-store";

interface ProjectSummaryData {
  projectSummary: {
    location: string;
    applicants: {
      status: string;
      count: number;
    };
    deadline: string;
  };
}

interface LaunchpadProjectSummaryCardProps {
  data?: ProjectSummaryData;
  launchpadId?: string;
  launchpadName?: string;
}

export default function LaunchpadProjectSummaryCard({
  data,
  launchpadId,
  launchpadName,
}: LaunchpadProjectSummaryCardProps) {
  const { selectedRoleIds, topPickRoleId } = useLaunchpadSelectedRoles();

  return (
    <Card className="h-fit bg-white p-6 xl:sticky xl:top-24">
      <div>Project Summary</div>
      <Separator className="mt-3 mb-5.5" />
      <div>
        <div className="flex w-full flex-1 flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#99A1AF]">Location</p>
            <p className="text-sm text-[#4A5565]">
              {data?.projectSummary.location}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#99A1AF]">Applicants</p>
            <p className="text-sm text-[#4A5565]">
              {data?.projectSummary.applicants.status}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#99A1AF]">Deadline</p>
            <p className="text-sm text-[#4A5565]">
              {data?.projectSummary.deadline}
            </p>
          </div>
        </div>
        <div className="mt-7 flex flex-col gap-4">
          {launchpadId ? (
            <LaunchpadSubmitApplicationDialog
              trigger={
                <Button
                  variant="default"
                  disabled={selectedRoleIds.length === 0}
                  className="w-full rounded-lg bg-[#2F6FE4] py-5"
                >
                  Apply Now
                </Button>
              }
              launchpadId={launchpadId}
              launchpadName={launchpadName}
              selectedRoleIds={selectedRoleIds}
              topPickRoleId={topPickRoleId}
            />
          ) : (
            <Button
              disabled
              variant="default"
              className="w-full rounded-lg bg-[#2F6FE4] py-5 opacity-50"
            >
              Apply Now
            </Button>
          )}
          <Button className="rounded-lg bg-white py-5" variant="outline">
            Save for Later
          </Button>
        </div>
      </div>
    </Card>
  );
}
