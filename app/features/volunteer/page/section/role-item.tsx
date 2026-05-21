import { Pencil, Trash2 } from "lucide-react";
import IconButton from "~/components/icon-button";
import type { FormDataVolunteerInput } from "~/services/volunteer/types";

const safeTrim = (value?: string | null) => (value ?? "").trim();

interface RoleItemProps {
  role: FormDataVolunteerInput["roles"][number];
  roleIndex: number;
  isEditing: boolean;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

export default function RoleItem({
  role,
  roleIndex,
  isEditing,
  onEdit,
  onRemove,
}: RoleItemProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border p-4 transition-colors ${
        isEditing
          ? "border-[#2f6fe4] bg-[#ebf5ff]"
          : "border-[#e5e7eb] bg-white hover:border-[#c8d6e5]"
      }`}
    >
      <div className="flex-1">
        <p className="text-sm font-semibold text-[#344256]">
          {safeTrim(role.title) || `Role ${roleIndex + 1}`}
        </p>
        <p className="mt-1 text-xs text-[#65758b]">{role.capacity}</p>

        {role.responsibilities.filter((r) => safeTrim(r)).length > 0 && (
          <div className="mt-2 text-[10px]">
            <p className="font-bold">Responsibilities</p>
            <div className="mt-1 flex flex-col flex-wrap gap-1">
              {role.responsibilities
                .filter((r) => safeTrim(r))
                .slice(0, 3)
                .map((r, i) => (
                  <span
                    key={`resp-${i}`}
                    className="rounded-full px-2 py-0.5 text-[10px] text-[#2A4A7B]"
                  >
                    {r}
                  </span>
                ))}
              {role.responsibilities.filter((r) => safeTrim(r)).length > 3 && (
                <span className="rounded-full px-2 py-0.5 text-[10px] text-[#2A4A7B]">
                  +{role.responsibilities.filter((r) => safeTrim(r)).length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {role.requirements.filter((r) => safeTrim(r)).length > 0 && (
          <div className="mt-2 text-[10px]">
            <p className="font-bold">Requirement</p>
            <div className="mt-1 flex flex-col flex-wrap gap-1">
              {role.requirements
                .filter((r) => safeTrim(r))
                .slice(0, 3)
                .map((r, i) => (
                  <span
                    key={`req-${i}`}
                    className="rounded-full px-2 py-0.5 text-[10px] text-[#92400E]"
                  >
                    {r}
                  </span>
                ))}
              {role.requirements.filter((r) => safeTrim(r)).length > 3 && (
                <span className="rounded-full px-2 py-0.5 text-[10px] text-[#92400E]">
                  +{role.requirements.filter((r) => safeTrim(r)).length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <IconButton
          ariaLabel={`Edit role ${roleIndex + 1}`}
          icon={<Pencil className="size-4 text-[#2f6fe4]" />}
          onClick={() => onEdit(roleIndex)}
          className="border"
        />
        <IconButton
          ariaLabel={`Remove role ${roleIndex + 1}`}
          icon={<Trash2 className="size-4 text-red-500" />}
          onClick={() => onRemove(roleIndex)}
          className="border"
        />
      </div>
    </div>
  );
}
