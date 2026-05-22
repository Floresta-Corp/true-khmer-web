import { Users, CheckCircle2, Star } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "~/components/ui/accordion";
import type { Role } from "~/services/volunteer/types/opportunities";
import { useVolunteerSelectedRoles } from "../../../../stores/selected-volunteer-roles-store";
import { cn } from "~/lib/utils";
import { AnimatePresence, motion } from "motion/react";

interface AvailableRolesSectionProps {
  roles: Role[];
  showHeader?: boolean;
  hideApplyButton?: boolean;
}

export default function AvailableRolesSection({
  roles,
  hideApplyButton,
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
          <RoleCard
            key={role.id}
            role={role}
            roles={roles}
            hideApplyButton={hideApplyButton}
          />
        ))}
      </Accordion>
    </div>
  );
}

interface RoleCardProps {
  role: Role;
  roles: Role[];
  hideApplyButton?: boolean;
}

function RoleCard({ role, hideApplyButton }: RoleCardProps) {
  const { addRole, removeRole, setTopPick, isRoleSelected, isTopPick } =
    useVolunteerSelectedRoles();

  const selected = isRoleSelected(role.id);
  const topPick = isTopPick(role.id);

  return (
    <AccordionItem
      value={role.id}
      className="overflow-hidden rounded-[16px] border border-gray-200"
    >
      <AccordionTrigger className="px-5.25 py-4 text-left no-underline hover:no-underline [&>svg]:size-[17.5px] [&>svg]:text-[#2f6fe4] rounded-none ">
        <div className="flex items-center justify-between w-full">
          <div>
            <h3 className="text-[16px] font-bold text-[#0a0a0a]">
              {role.title}
            </h3>
            <p className="mt-1 flex items-center gap-2 text-[14px] font-medium text-[#99A1AF]">
              <span className="text-[#009966] text-[14px] font-medium">
                {role.capacity} spots open
              </span>
            </p>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-5.25 pt-7.25 rounded-b-[16px] border-t border-[#0000001A]">
        <div className="grid gap-5 lg:grid-cols-2">
          <ResponsibilitiesSection items={role.responsibilities} />
          <RequirementsSection items={role.requirements} />
        </div>

        {!hideApplyButton ? (
          <div className="my-7.25 flex justify-end pt-7.25 w-full">
            <div className="flex items-center gap-2 w-full">
              <Button
                disabled={role.viewerApplied}
                className={cn(
                  "h-10 flex-1 bg-[#1c5dd4] px-6 text-sm font-medium text-[#f8fafc] hover:bg-[#184fb0]",
                  role.viewerApplied && "opacity-50",
                  !selected && "w-full",
                )}
                onClick={() => {
                  if (!selected) addRole(role.id);
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={selected ? "selected" : "select"}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                  >
                    {selected ? "Selected" : "Select Role"}
                  </motion.span>
                </AnimatePresence>
              </Button>
              <AnimatePresence>
                {selected && (
                  <motion.div
                    key="top-pick-btn"
                    initial={{ opacity: 0, x: -16, width: 0 }}
                    animate={{ opacity: 1, x: 0, width: "auto" }}
                    exit={{ opacity: 0, x: 16, width: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <Button
                      type="button"
                      variant={topPick ? "default" : "outline"}
                      className={cn(
                        "h-10 px-3 text-sm",
                        topPick
                          ? "bg-[#2f6fe4] text-white hover:bg-[#245fca]"
                          : "border-[#e1e7ef] text-[#65758b] hover:bg-[#f8fafc]",
                      )}
                      onClick={() => setTopPick(role.id)}
                    >
                      <Star
                        className={cn(
                          "size-4",
                          topPick && "fill-white",
                        )}
                      />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {selected && (
                  <motion.div
                    key="remove-btn"
                    initial={{ opacity: 0, x: -16, width: 0 }}
                    animate={{ opacity: 1, x: 0, width: "auto" }}
                    exit={{ opacity: 0, x: 16, width: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut", delay: 0.05 }}
                    className="overflow-hidden"
                  >
                    <Button
                      type="button"
                      variant="destructive"
                      className="h-10 px-3 text-sm"
                      onClick={() => removeRole(role.id)}
                    >
                      Remove
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="mb-3" />
        )}
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
            className="flex gap-3 text-sm text-gray-600 dark:text-slate-300"
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
            className="flex gap-3 text-sm text-gray-600 dark:text-slate-300"
          >
            <CheckCircle2 className="mt-0.5 size-[17.5px] shrink-0 text-[#009966]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
