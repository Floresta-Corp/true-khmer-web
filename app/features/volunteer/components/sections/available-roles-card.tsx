import AvailableRolesSection from "./available-role-section";
import { Users } from "lucide-react";
import type { Opportunity } from "~/services/volunteer/types/opportunities";

interface AvailableRolesCardProps {
  roles: Opportunity["roles"];
  hideApplyButton?: boolean;
  compact?: boolean;
  hideIcon?: boolean;
}

export default function AvailableRolesCard({
  roles,
  hideApplyButton,
  compact = false,
  hideIcon = false,
}: AvailableRolesCardProps) {
  const header = (
    <div className="flex items-center gap-3.5">
      {!hideIcon && <Users className="size-6 text-[#2563eb]" />}
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-8.25 text-[22px] text-[#030213]">
        Available Roles
      </p>
    </div>
  );

  if (compact) {
    return (
      <div>
        {header}
        <div className="mt-4">
          <AvailableRolesSection
            roles={roles}
            showHeader={false}
            hideApplyButton={hideApplyButton}
          />
        </div>
      </div>
    );
  }

  return (
    <article className="rounded-[14px] border border-[#e1e7ef] bg-white p-8">
      {header}

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
