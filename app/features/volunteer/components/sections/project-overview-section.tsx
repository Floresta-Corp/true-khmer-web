import ExpandableText from "~/components/expandable-text";
import type { Opportunity } from "~/services/volunteer/types/opportunities";

interface ProjectOverviewSectionProps {
  volunteer: Opportunity;
}

export default function ProjectOverviewSection({
  volunteer,
}: ProjectOverviewSectionProps) {
  const overview =
    volunteer?.overview ??
    "Join the Khmer Heritage Trust in a critical mission to preserve our nation's architectural history. We are looking for dedicated volunteers to help document and protect delicate 10th-century carvings at lesser-known temple sites in the Siem Reap region. Your work will directly contribute to the digital archives used by global scholars and local preservationists.";

  return (
    <div className="space-y-3.5">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
        Opportunity Overview
      </h2>
      <ExpandableText>{overview}</ExpandableText>
    </div>
  );
}
