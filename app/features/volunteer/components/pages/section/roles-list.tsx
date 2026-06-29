import { AnimatePresence, motion } from "motion/react";
import { Button } from "~/components/ui/button";
import RoleItem from "./role-item";
import type { FormDataVolunteerInput } from "~/features/volunteer/types";

const safeTrim = (value?: string | null) => (value ?? "").trim();

const isBlankRole = (
  role: FormDataVolunteerInput["roles"][number],
) =>
  !safeTrim(role.title) &&
  role.capacity === 1 &&
  role.responsibilities.length === 1 &&
  !safeTrim(role.responsibilities[0]) &&
  role.requirements.length === 1 &&
  !safeTrim(role.requirements[0]);

interface RolesListProps {
  roles: FormDataVolunteerInput["roles"];
  editingIndex: number | null;
  onEditRole: (index: number) => void;
  onRemoveRole: (index: number) => void;
  originalRoles?: FormDataVolunteerInput["roles"];
  onResetRoles?: () => void;
}

export default function RolesList({
  roles,
  editingIndex,
  onEditRole,
  onRemoveRole,
  originalRoles,
  onResetRoles,
}: RolesListProps) {
  return (
    <section className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-[#65758b]">
          Roles added ({roles.some((role) => !isBlankRole(role)) ? roles.length : 0})
        </h4>
        {originalRoles && onResetRoles ? (
          <Button
            type="button"
            variant="ghost"
            className="h-8 px-3 text-xs text-blue-500 cursor-pointer"
            onClick={onResetRoles}
          >
            Reset roles
          </Button>
        ) : null}
      </div>

      {roles.length === 0 || (roles.length === 1 && isBlankRole(roles[0])) ? (
        <div className="rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-6 text-sm font-medium text-[#99a1af]">
          No roles added yet. Define at least one role so volunteers know how to
          contribute.
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <div className="space-y-2" key="roles-list">
            {roles.map((role, index) => (
              <motion.div
                key={`role-${role.title}-${index}`}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <RoleItem
                  role={role}
                  roleIndex={index}
                  isEditing={index === editingIndex}
                  onEdit={onEditRole}
                  onRemove={onRemoveRole}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </section>
  );
}
