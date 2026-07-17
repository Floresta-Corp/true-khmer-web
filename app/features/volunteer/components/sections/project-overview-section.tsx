import ExpandableText from "~/components/expandable-text";
import type { Opportunity } from "~/features/volunteer/types/opportunities";

interface ProjectOverviewSectionProps {
  volunteer: Opportunity;
}

export default function ProjectOverviewSection({
  volunteer,
}: ProjectOverviewSectionProps) {
  const overview = volunteer?.overview ?? "";

  return (
    <div className="space-y-3.5">
      <h2 className="mb-3.5 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
        Opportunity Overview
      </h2>
      <ExpandableText>{overview}</ExpandableText>
    </div>
  );
}
