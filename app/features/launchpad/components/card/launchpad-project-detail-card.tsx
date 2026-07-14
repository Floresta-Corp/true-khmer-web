import ExpandableText from "~/components/expandable-text";
import { Separator } from "~/components/ui/separator";
import type { LaunchpadDetail } from "~/features/launchpad/types";

interface LaunchpadProjectDetailCardProps {
  project: LaunchpadDetail;
}

export default function LaunchpadProjectDetailCard({
  project,
}: LaunchpadProjectDetailCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start gap-x-10 gap-y-4">
        <div>
          <div className="pb-1 text-[11px] font-medium tracking-wide text-[#9EACC0] uppercase">
            Location
          </div>
          <div className="text-[15px] font-semibold text-[#0F1729]">
            {project.city.name}
          </div>
        </div>
        <div>
          <div className="pb-1 text-[11px] font-medium tracking-wide text-[#9EACC0] uppercase">
            Deadline
          </div>
          <div className="text-[15px] font-semibold text-[#0F1729]">
            {formatDate(project.deadline)}
          </div>
        </div>
        <div>
          <div className="pb-1 text-[11px] font-medium tracking-wide text-[#9EACC0] uppercase">
            View
          </div>
          <div className="text-[15px] font-semibold text-[#0F1729]">
            {project.totalView.toLocaleString()} views
          </div>
        </div>
      </div>
      <Separator />
      <div>
        <h2 className="mb-6 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Opportunity Overview
        </h2>
        <ExpandableText className="mb-4">{project.description}</ExpandableText>
      </div>
    </div>
  );
}
