import { Separator } from "~/components/ui/separator";
import type { LaunchpadDetail } from "~/services/launchpad/types/project";

interface LaunchpadProjectDetailCardProps {
  project: LaunchpadDetail;
}

export default function LaunchpadProjectDetailCard({
  project,
}: LaunchpadProjectDetailCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section className="bg-white p-6">
      <div className="flex flex-wrap items-start gap-x-10 gap-y-4">
        <div>
          <div className="pb-1 text-[11px] font-medium uppercase tracking-wide text-[#9EACC0]">
            Location
          </div>
          <div className="text-[15px] font-semibold text-[#0F1729]">
            {project.city.name}
          </div>
        </div>
        <div>
          <div className="pb-1 text-[11px] font-medium uppercase tracking-wide text-[#9EACC0]">
            Deadline
          </div>
          <div className="text-[15px] font-semibold text-[#0F1729]">
            {formatDate(project.deadline)}
          </div>
        </div>
        <div>
          <div className="pb-1 text-[11px] font-medium uppercase tracking-wide text-[#9EACC0]">
            Visibility
          </div>
          <div className="text-[15px] font-semibold text-[#0F1729]">
            {project.totalView.toLocaleString()} views
          </div>
        </div>
      </div>
      <Separator className="my-5 bg-[#E7ECF3]" />
      <div>
        <div className="mb-3 text-xl font-semibold text-[#0F1729]">
          Project Overview
        </div>
        <p className="whitespace-pre-line text-sm leading-6 text-[#6A7282]">
          {project.description}
        </p>
      </div>
    </section>
  );
}
