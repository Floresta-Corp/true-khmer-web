import { Users, CheckCircle2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "~/components/ui/accordion";
import type { Role } from "~/services/volunteer/types/opportunities";
import VolunteerApplicationDialog from "../dialog/volunteer-application-dialog";

interface AvailableRolesSectionProps {
  roles: Role[];
  showHeader?: boolean;
}

export default function AvailableRolesSection({
  roles,
  showHeader = true,
}: AvailableRolesSectionProps) {
  return (
    <div className="space-y-5">
      {showHeader && (
        <h2 className="flex items-center gap-2.5 text-lg font-semibold tracking-[-0.44px] text-[#030213]">
          <Users className="size-[17.5px] text-[#2563eb]" />
          Available Roles ({roles.reduce((a, b) => a + b.capacity, 0)})
        </h2>
      )}

      <Accordion
        type="multiple"
        className="space-y-5"
        defaultValue={[roles[0].id]}
      >
        {roles.map((role) => (
          <RoleCard key={role.id} role={role} roles={roles} />
        ))}
      </Accordion>
    </div>
  );
}

interface RoleCardProps {
  role: Role;
  roles: Role[];
}

function RoleCard({ role, roles }: RoleCardProps) {
  return (
    <AccordionItem
      value={role.id}
      className="overflow-hidden rounded-[16px] border border-gray-200"
    >
      <AccordionTrigger className="px-5.25 py-4 text-left no-underline hover:no-underline [&>svg]:size-[17.5px] [&>svg]:text-[#2f6fe4] bg-[#f8fafc] rounded-none ">
        <div className="flex items-center justify-between w-full">
          <div>
            <h3 className="text-[16px] font-bold text-[#0a0a0a]">
              {role.title}
            </h3>
            <p className="mt-1 flex items-center gap-2 text-[14px] font-medium text-[#99A1AF]">
              {role.commitmentLabel}
              <span className="size-[3.5px] rounded-full bg-[#d1d5dc]" />
              <span className="text-[#009966] text-[14px] font-medium">
                {role.capacity} spots open
              </span>
            </p>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-5.25 pt-7.25 bg-[#f8fafc] rounded-b-[16px] border-t border-[#0000001A]">
        <div className="grid gap-5 lg:grid-cols-2">
          <ResponsibilitiesSection items={role.responsibilities} />
          <RequirementsSection items={role.requirements} />
        </div>

        <div className="my-7.25 flex justify-end pt-7.25">
          <VolunteerApplicationDialog
            roles={roles}
            initialRoleId={role.id}
            trigger={
              <Button className="h-10 w-full bg-[#1c5dd4] px-6 text-sm font-medium text-[#f8fafc] hover:bg-[#184fb0]">
                Apply for this Role
              </Button>
            }
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

interface ResponsibilitiesSectionProps {
  items: string[];
}

function ResponsibilitiesSection({ items }: ResponsibilitiesSectionProps) {
  return (
    <div className="space-y-3.5">
      <h4 className="font-semibold text-[16px] text-[#030213] uppercase">
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
      <h4 className="font-semibold text-[16px] text-[#030213] uppercase">
        Requirements
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
