import RoleItem from "./role-item";
import type { VolunteerOpportunityInput } from "~/services/volunteer/volunteer-types";

interface RolesListProps {
  roles: VolunteerOpportunityInput["roles"];
  activeRoleIndex: number;
  onSelectRole: (index: number) => void;
  onRemoveRole: (index: number) => void;
}

export default function RolesList({
  roles,
  activeRoleIndex,
  onSelectRole,
  onRemoveRole,
}: RolesListProps) {
  return (
    <section className="space-y-3.5">
      <h4 className="text-sm font-semibold text-[#65758b]">
        Roles added ({Math.max(roles.length - 1, 0)})
      </h4>

      {roles.length <= 1 ? (
        <div className="rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-6 text-sm font-medium text-[#99a1af]">
          No roles added yet. Define at least one role so volunteers know how to
          contribute.
        </div>
      ) : (
        <div className="space-y-2">
          {roles.slice(1).map((role, index) => {
            const roleIndex = index + 1;
            const isActive = roleIndex === activeRoleIndex;

            return (
              <RoleItem
                key={`role-${roleIndex}`}
                role={role}
                roleIndex={roleIndex}
                isActive={isActive}
                onSelect={onSelectRole}
                onRemove={onRemoveRole}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
