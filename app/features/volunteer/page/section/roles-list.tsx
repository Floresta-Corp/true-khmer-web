import { AnimatePresence, motion } from "motion/react";
import RoleItem from "./role-item";
import type { FormDataVolunteerInput } from "~/services/volunteer/types";

interface RolesListProps {
  roles: FormDataVolunteerInput["roles"];
  editingIndex: number | null;
  onEditRole: (index: number) => void;
  onRemoveRole: (index: number) => void;
}

export default function RolesList({
  roles,
  editingIndex,
  onEditRole,
  onRemoveRole,
}: RolesListProps) {
  return (
    <section className="space-y-3.5">
      <h4 className="text-sm font-semibold text-[#65758b]">
        Roles added ({roles.length})
      </h4>

      {roles.length === 0 ? (
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
