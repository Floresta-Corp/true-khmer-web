import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import LaunchpadSubmitApplicationDialog from "../dialog/launchpad-submit-application-dialog";

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
  return (
    <Card className="bg-white p-6 h-fit xl:sticky xl:top-24">
      <div>Project Summary</div>
      <Separator className="mt-3 mb-5.5" />
      <div>
        <div className="w-full flex gap-4 flex-1 flex-col justify-between">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-[#99A1AF]">Location</p>
            <p className="text-sm text-[#4A5565]">
              {data?.projectSummary.location}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-[#99A1AF]">Applicants</p>
            <p className="text-sm text-[#4A5565]">
              {data?.projectSummary.applicants.status}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-[#99A1AF]">Deadline</p>
            <p className="text-sm text-[#4A5565]">
              {data?.projectSummary.deadline}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-7">
          {launchpadId ? (
            <LaunchpadSubmitApplicationDialog
              trigger={
                <Button
                  variant="default"
                  className="w-full rounded-lg py-5 bg-[#2F6FE4]"
                >
                  Apply Now
                </Button>
              }
              launchpadId={launchpadId}
              launchpadName={launchpadName}
            />
          ) : (
            <Button
              disabled
              variant="default"
              className="w-full rounded-lg py-5 bg-[#2F6FE4] opacity-50"
            >
              Apply Now
            </Button>
          )}
          <Button className="bg-white rounded-lg py-5" variant="outline">
            Save for Later
          </Button>
        </div>
      </div>
    </Card>
  );
}
