import { Plus, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import IconButton from "~/components/icon-button";
import { Input } from "~/components/ui/input";
interface SectionLabelProps {
  children: string;
}

function SectionLabel({ children }: SectionLabelProps) {
  return (
    <p className="text-[14px] font-semibold leading-[19.5px] text-[#344256]">
      {children}
    </p>
  );
}

interface RequirementsSectionProps {
  requirements: string[];
  errors?: string[];
  onUpdate: (requirements: string[]) => void;
  onRemovePoint: (index: number) => void;
}

export default function RequirementsSection({
  requirements,
  errors,
  onUpdate,
  onRemovePoint,
}: RequirementsSectionProps) {
  const handleAddPoint = () => {
    onUpdate([...requirements, ""]);
  };

  const lastIsEmpty = requirements[requirements.length - 1]?.trim() === "";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <SectionLabel>Requirements</SectionLabel>
        <Button
          type="button"
          variant="ghost"
          className="h-auto p-0 text-xs font-semibold text-[#2f6fe4]"
          onClick={handleAddPoint}
          disabled={lastIsEmpty}
        >
          + Add point
        </Button>
      </div>

      <div className="mt-3 space-y-3">
        {requirements.map((requirement, index) => (
          <div key={`req-${index}`} className="flex items-center gap-2">
            <Input
              placeholder="What skills are you looking for?"
              value={requirement}
              onChange={(e) => {
                const newRequirements = [...requirements];
                newRequirements[index] = e.target.value;
                onUpdate(newRequirements);
              }}
              className="h-11 flex-1 rounded-lg border border-transparent bg-[#f8fafc] px-4 text-sm font-medium text-[#364153] placeholder:text-[#c8d6e5] focus-visible:ring-2 focus-visible:ring-blue-500/45 focus-visible:border-transparent"
            />
            {requirements.length > 1 && (
              <IconButton
                ariaLabel={`Remove requirement ${index + 1}`}
                icon={<Trash2 className="size-4 text-red-500" />}
                onClick={() => onRemovePoint(index)}
                className="border"
              />
            )}
          </div>
        ))}
      </div>

      {errors?.map(
        (itemError, index) =>
          itemError && (
            <p key={`${itemError}-${index}`} className="text-xs text-red-500">
              {itemError}
            </p>
          ),
      )}
    </div>
  );
}
