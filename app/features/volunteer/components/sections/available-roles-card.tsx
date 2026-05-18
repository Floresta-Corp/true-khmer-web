import AvailableRolesSection from "./available-role-section";
import { Users } from "lucide-react";
import type { Opportunity } from "~/services/volunteer/types/opportunities";

interface AvailableRolesCardProps {
  roles: Opportunity["roles"];
  hideApplyButton?: boolean;
}

export default function AvailableRolesCard({
  roles,
  hideApplyButton,
}: AvailableRolesCardProps) {
  return (
    <article className="rounded-[14px] border border-[#e1e7ef] bg-white p-8">
      <div className="flex items-center gap-3.5">
        <Users className="size-6 text-[#2563eb]" />
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-8.25 text-[22px] text-[#030213]">
          Available Roles
        </p>
      </div>

      <div className="mt-4">
        <AvailableRolesSection
          roles={roles}
          showHeader={false}
          hideApplyButton={hideApplyButton}
        />
      </div>
    </article>
  );
}
