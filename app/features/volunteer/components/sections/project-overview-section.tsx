import ExpandableText from "~/components/expandable-text";
import type { Opportunity } from "~/services/volunteer/types/opportunities";

interface ProjectOverviewSectionProps {
  volunteer: Opportunity;
}

export default function ProjectOverviewSection({
  volunteer,
}: ProjectOverviewSectionProps) {
  const overview = volunteer?.overview ?? "";

  return (
    <div className="space-y-3.5">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
        Opportunity Overview
      </h2>
      <ExpandableText>{overview}</ExpandableText>
    </div>
  );
}
