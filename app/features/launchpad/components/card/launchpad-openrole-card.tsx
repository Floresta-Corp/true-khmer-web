import { Plus, Users2 } from "lucide-react";
import { useId } from "react";
import { Separator } from "~/components/ui/separator";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import FieldLabel from "~/components/field-label";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";

interface LaunchpadOpenRoleCardProps {
  name: string;
  capacity: number;
  description: string;
  roleError?: string;
  editingIndex: number | null;
  onNameChange: (value: string) => void;
  onCapacityChange: (value: number) => void;
  onDescriptionChange: (value: string) => void;
  onAddRole: () => void;
  onCancelEdit: () => void;
}

export default function LaunchpadOpenRoleCard({
  name,
  capacity,
  description,
  roleError,
  editingIndex,
  onNameChange,
  onCapacityChange,
  onDescriptionChange,
  onAddRole,
  onCancelEdit,
}: LaunchpadOpenRoleCardProps) {
  const roleErrorId = useId();

  return (
    <Card className="p-6 space-y-5">
      <div className="flex items-center gap-3">
        <Users2 size={17.5} className="text-blue-500" />
        <div className="text-xl font-medium">
          Open Roles<span className="text-destructive">*</span>
        </div>
      </div>
      <Separator />
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <FieldLabel>Role title</FieldLabel>
          <Input
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="e.g., Field Researcher"
            className="h-12.5 rounded-xl border-none px-4 bg-[#F8FAFC] focus-visible:ring-2 focus-visible:ring-blue-500/45 focus-visible:border-transparent"
          />
        </div>
        <div className="space-y-3">
          <FieldLabel>Capacity</FieldLabel>
          <Input
            type="number"
            min={1}
            max={1000}
            value={capacity}
            onChange={(event) => {
              const nextValue = Number.parseInt(event.target.value, 10);
              onCapacityChange(Number.isFinite(nextValue) ? nextValue : 1);
            }}
            placeholder="1"
            className="h-12.5 rounded-xl border-none px-4 bg-[#F8FAFC] focus-visible:ring-2 focus-visible:ring-blue-500/45 focus-visible:border-transparent"
          />
        </div>
        <div className="space-y-3 col-span-2">
          <FieldLabel>Role Description</FieldLabel>
          <Textarea
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            placeholder="What will this person do and what skills are you looking for?"
            className="h-12.5 rounded-xl border-none px-4 bg-[#F8FAFC] focus-visible:ring-2 focus-visible:ring-blue-500/45 focus-visible:border-transparent"
          />
        </div>
        <div className="col-span-2 flex items-center gap-3">
          <Button
            type="button"
            onClick={onAddRole}
            disabled={name.trim() === ""}
            aria-describedby={roleError ? roleErrorId : undefined}
            className="cursor-pointer h-10 bg-blue-500 hover:bg-blue-600"
          >
            <Plus /> {editingIndex !== null ? "Save Changes" : "Add role"}
          </Button>
          {editingIndex !== null && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancelEdit}
              className="cursor-pointer h-10 text-[#99a1af]"
            >
              Cancel
            </Button>
          )}
        </div>
        {roleError ? (
          <p id={roleErrorId} className="text-xs text-red-500">
            {roleError}
          </p>
        ) : null}
      </div>
    </Card>
  );
}
