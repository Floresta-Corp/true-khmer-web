import { Plus, Users } from "lucide-react";
import { Button } from "~/components/ui/button";
import RoleDetailsForm from "./role-details-form";
import ResponsibilitiesSection from "./responsibilities-section";
import RequirementsSection from "./requirements-section";

import type { VolunteerRoleErrors } from "../volunteer-post-page-2";
import type { FormDataVolunteerInput } from "~/services/volunteer/types";

interface OpenRolesFormProps {
  currentRole: FormDataVolunteerInput["roles"][number] | undefined;
  activeRoleIndex: number;
  errors?: VolunteerRoleErrors;
  onRoleChange: <K extends keyof FormDataVolunteerInput["roles"][number]>(
    index: number,
    field: K,
    value: FormDataVolunteerInput["roles"][number][K],
  ) => void;
  onAddRole: () => void;
  onRemovePoint: (
    field: "responsibilities" | "requirements",
    index: number,
  ) => void;
}

export default function OpenRolesForm({
  currentRole,
  activeRoleIndex,
  errors,
  onRoleChange,
  onAddRole,
  onRemovePoint,
}: OpenRolesFormProps) {
  if (!currentRole) return null;

  const hasRoleErrors =
    errors?.title || errors?.commitmentLabel || errors?.capacity;

  return (
    <section
      className="rounded-2xl border border-[#E1E7EF] bg-white p-6"
      data-role-error={hasRoleErrors ? "true" : undefined}
    >
      <div className="flex items-center gap-3">
        <Users className="size-6 text-[#2f6fe4]" />
        <h3 className="text-[22px] font-bold leading-8.25 text-[#344256]">
          Open Roles
          <span className="inline-block text-[#fb3748]">*</span>
        </h3>
      </div>

      <div className="mt-5 border-t border-[#F3F4F6]" />

      <div className="mt-5 space-y-5">
        <RoleDetailsForm
          title={currentRole.title}
          commitmentLabel={currentRole.commitmentLabel}
          capacity={currentRole.capacity}
          errors={errors}
          onTitleChange={(value) =>
            onRoleChange(activeRoleIndex, "title", value)
          }
          onCommitmentChange={(value) =>
            onRoleChange(activeRoleIndex, "commitmentLabel", value)
          }
          onCapacityChange={(value) =>
            onRoleChange(activeRoleIndex, "capacity", value)
          }
        />

        <div className="space-y-4">
          <ResponsibilitiesSection
            responsibilities={currentRole.responsibilities}
            errors={errors?.responsibilityErrors}
            onUpdate={(responsibilities) =>
              onRoleChange(
                activeRoleIndex,
                "responsibilities",
                responsibilities,
              )
            }
            onRemovePoint={(index) => onRemovePoint("responsibilities", index)}
          />

          <RequirementsSection
            requirements={currentRole.requirements}
            errors={errors?.requirementErrors}
            onUpdate={(requirements) =>
              onRoleChange(activeRoleIndex, "requirements", requirements)
            }
            onRemovePoint={(index) => onRemovePoint("requirements", index)}
          />
        </div>

        <div className="border-t border-[#F3F4F6] pt-4">
          <Button
            type="button"
            className="h-10 w-full bg-[#2f6fe4] text-sm text-[#f8fafc] hover:bg-[#245fca]"
            onClick={onAddRole}
          >
            <Plus className="size-4" />
            Add role
          </Button>
        </div>
      </div>
    </section>
  );
}
