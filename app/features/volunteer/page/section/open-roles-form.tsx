import { Plus, Users, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import RoleDetailsForm from "./role-details-form";
import ResponsibilitiesSection from "./responsibilities-section";
import RequirementsSection from "./requirements-section";

import type { VolunteerRoleErrors } from "../volunteer-post-page-2";

type DraftRole = {
  title: string;
  commitmentLabel: string;
  capacity: number;
  responsibilities: string[];
  requirements: string[];
};

interface OpenRolesFormProps {
  draftRole: DraftRole;
  editingIndex: number | null;
  errors?: VolunteerRoleErrors;
  hasSavedRoles: boolean;
  onDraftChange: <K extends keyof DraftRole>(
    field: K,
    value: DraftRole[K],
  ) => void;
  onAddRole: () => void;
  onCancelEdit: () => void;
  onRemovePoint: (
    field: "responsibilities" | "requirements",
    index: number,
  ) => void;
}

export default function OpenRolesForm({
  draftRole,
  editingIndex,
  errors,
  hasSavedRoles,
  onDraftChange,
  onAddRole,
  onCancelEdit,
  onRemovePoint,
}: OpenRolesFormProps) {
  const hasRoleErrors =
    errors?.title || errors?.commitmentLabel || errors?.capacity;

  return (
    <section
      className="rounded-2xl border border-[#E1E7EF] bg-white p-6"
      data-role-error={hasRoleErrors ? "true" : undefined}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="size-6 text-[#2f6fe4]" />
          <h3 className="text-[22px] font-bold leading-8.25 text-[#344256]">
            {editingIndex !== null ? "Edit Role" : "Add a Role"}
            {!hasSavedRoles && (
              <span className="inline-block text-[#fb3748]">*</span>
            )}
          </h3>
        </div>
        {editingIndex !== null && (
          <Button
            type="button"
            variant="ghost"
            className="h-8 px-2 text-[#99a1af] hover:text-[#344256]"
            onClick={onCancelEdit}
          >
            <X className="size-4 mr-1" />
            Cancel
          </Button>
        )}
      </div>

      <div className="mt-5 border-t border-[#F3F4F6]" />

      <div className="mt-5 space-y-5">
        <RoleDetailsForm
          title={draftRole.title}
          commitmentLabel={draftRole.commitmentLabel}
          capacity={draftRole.capacity}
          errors={errors}
          onTitleChange={(value) => onDraftChange("title", value)}
          onCommitmentChange={(value) =>
            onDraftChange("commitmentLabel", value)
          }
          onCapacityChange={(value) => onDraftChange("capacity", value)}
        />

        <div className="space-y-4">
          <ResponsibilitiesSection
            responsibilities={draftRole.responsibilities}
            errors={errors?.responsibilityErrors}
            onUpdate={(responsibilities) =>
              onDraftChange("responsibilities", responsibilities)
            }
            onRemovePoint={(index) => onRemovePoint("responsibilities", index)}
          />

          <RequirementsSection
            requirements={draftRole.requirements}
            errors={errors?.requirementErrors}
            onUpdate={(requirements) =>
              onDraftChange("requirements", requirements)
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
            {editingIndex !== null ? "Save Changes" : "Add Role"}
          </Button>
        </div>
      </div>
    </section>
  );
}
