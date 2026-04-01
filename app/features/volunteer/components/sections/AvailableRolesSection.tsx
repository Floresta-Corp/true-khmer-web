import {
  Users,
  ChevronDown,
  Target,
  Zap,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import VolunteerApplicationDialog from "../dialog/VolunteerApplicationDialog";

interface Role {
  id: number;
  title: string;
  commitment: string;
  spotLeft: number;
  responsibilities: string[];
  requirements: string[];
}

interface AvailableRolesSectionProps {
  roles: Role[];
}

export default function AvailableRolesSection({
  roles,
}: AvailableRolesSectionProps) {
  return (
    <div className="space-y-5">
      <h2 className="flex items-center gap-2.5 text-lg font-semibold tracking-[-0.44px] text-[#030213]">
        <Users className="size-[17.5px] text-[#2563eb]" />
        Available Roles ({roles.length})
      </h2>

      <div className="space-y-5">
        {roles.map((role) => (
          <RoleCard key={role.id} role={role} />
        ))}
      </div>
    </div>
  );
}

interface RoleCardProps {
  role: Role;
}

function RoleCard({ role }: RoleCardProps) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-[#e1e7ef]">
      <div className="flex items-center justify-between px-5.25 py-6">
        <div className="flex items-center gap-3.5">
          <div className="flex size-5.25 items-center justify-center rounded-full border-2 border-[#2f6fe4] bg-[#2f6fe4]">
            <div className="size-1.75 rounded-full bg-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0a0a0a]">{role.title}</h3>
            <p className="mt-1 flex items-center gap-2 text-[11px] font-bold text-[#99a1af]">
              {role.commitment}
              <span className="size-[3.5px] rounded-full bg-[#d1d5dc]" />
              <span className="text-[#009966]">{role.spotLeft} spots left</span>
            </p>
          </div>
        </div>
        <ChevronDown className="size-[17.5px] text-[#2f6fe4]" />
      </div>

      <div className="border-t border-black/10 px-5.25 pt-7.25">
        <div className="grid gap-5 lg:grid-cols-2">
          <ResponsibilitiesSection items={role.responsibilities} />
          <RequirementsSection items={role.requirements} />
        </div>

        <div className="my-7.25 flex justify-end border-t border-[#f3f4f6] pt-7.25">
          <VolunteerApplicationDialog
            role={role}
            trigger={
              <Button className="h-10 bg-[#2f6fe4] px-6 text-sm font-medium text-[#f8fafc] hover:bg-[#245fca]">
                Apply for this Role
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}

interface ResponsibilitiesSectionProps {
  items: string[];
}

function ResponsibilitiesSection({ items }: ResponsibilitiesSectionProps) {
  return (
    <div className="space-y-3.5">
      <h4 className="flex items-center gap-2 text-sm font-bold text-[#030213]">
        <Target className="size-3.5 text-[#2f6fe4]" />
        Responsibilities
      </h4>
      <ul className="space-y-3.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-sm font-medium leading-[22.75px] text-[#4a5565]"
          >
            <CheckCircle2 className="mt-0.5 size-[17.5px] shrink-0 text-[#009966]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface RequirementsSectionProps {
  items: string[];
}

function RequirementsSection({ items }: RequirementsSectionProps) {
  return (
    <div className="space-y-3.5">
      <h4 className="flex items-center gap-2 text-sm font-bold text-[#030213]">
        <Zap className="size-3.5 text-[#fe9a00]" />
        Requirements
      </h4>
      <ul className="space-y-3.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-sm font-medium leading-[22.75px] text-[#4a5565]"
          >
            <span className="mt-0.5 flex size-[17.5px] shrink-0 items-center justify-center rounded-full bg-[#fffbeb]">
              <Circle className="size-[5.25px] fill-[#fe9a00] text-[#fe9a00]" />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
