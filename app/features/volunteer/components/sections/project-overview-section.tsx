import type { Opportunity } from "~/services/volunteer/types/opportunities";

interface ProjectOverviewSectionProps {
  volunteer: Opportunity;
}

export default function ProjectOverviewSection({
  volunteer,
}: ProjectOverviewSectionProps) {
  return (
    <div className="space-y-3.5">
      <h2 className="text-lg font-semibold tracking-[-0.44px] text-[#030213]">
        Opportunity Overview
      </h2>
      <p className="text-[15px] font-medium leading-[24.375px] tracking-[-0.23px] text-[#4a5565]">
        {volunteer?.overview ??
          "Join the Khmer Heritage Trust in a critical mission to preserve our nation's architectural history. We are looking for dedicated volunteers to help document and protect delicate 10th-century carvings at lesser-known temple sites in the Siem Reap region. Your work will directly contribute to the digital archives used by global scholars and local preservationists."}
      </p>
    </div>
  );
}
