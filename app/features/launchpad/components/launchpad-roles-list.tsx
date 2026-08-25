import { Pencil } from "lucide-react";
import { Button } from "~/components/ui/button";

type LaunchpadRoleInput = {
  name: string;
  capacity: number;
  description: string;
};

type Props = {
  roles: LaunchpadRoleInput[];
  originalRoles?: LaunchpadRoleInput[];
  editingIndex: number | null;
  onResetRoles?: () => void;
  onRolesChange: (roles: LaunchpadRoleInput[]) => void;
  onEditRole: (index: number) => void;
};

export default function LaunchpadRolesList({
  roles,
  originalRoles,
  editingIndex,
  onResetRoles,
  onRolesChange,
  onEditRole,
}: Props) {
  const count = roles.length;

  const handleRemoveRole = (index: number) => {
    onRolesChange(roles.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="gap-2">
      <div className="flex items-center justify-between pb-1">
        <div>Roles added ({count})</div>
        {originalRoles && onResetRoles ? (
          <Button
            type="button"
            variant="ghost"
            className="h-8 cursor-pointer px-3 text-xs text-blue-500"
            onClick={onResetRoles}
          >
            Reset roles
          </Button>
        ) : null}
      </div>
      {count === 0 ? (
        <div className="w-full rounded-xl bg-[#F8FAFC] p-6">
          No roles added yet. Add at least one so collaborators know how to
          contribute.
        </div>
      ) : (
        <div className="space-y-2">
          {roles.map((role, index) => (
            <div
              key={`${role.name}-${index}`}
              className={`w-full rounded-xl border p-4 ${
                editingIndex === index
                  ? "border-blue-500 bg-blue-50"
                  : "border-[#E1E7EF]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-medium">{role.name}</div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => onEditRole(index)}
                  >
                    <Pencil className="size-4 text-blue-500" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => handleRemoveRole(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
              <div className="text-sm text-[#65758B]">
                Capacity: {role.capacity}
              </div>
              {role.description ? (
                <div className="text-sm text-[#65758B]">{role.description}</div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
