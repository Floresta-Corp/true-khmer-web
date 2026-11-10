import { useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";
import IconButton from "~/components/icon-button";
import { Input } from "~/components/ui/input";
import {
  AddAnotherPointButton,
  AddPointEmptyState,
} from "../../add-point-controls";

interface SectionLabelProps {
  children: string;
}

function SectionLabel({ children }: SectionLabelProps) {
  return (
    <p className="text-[14px] leading-[19.5px] font-semibold text-[#344256]">
      {children}
      <span className="inline-block text-[#fb3748]">*</span>
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
  const isEmpty = requirements.length === 0;
  const lastIsEmpty = requirements[requirements.length - 1]?.trim() === "";

  const handleAddPoint = () => {
    onUpdate([...requirements, ""]);
  };

  // Put the cursor in a point as soon as it's added.
  const prevCount = useRef(requirements.length);
  useEffect(() => {
    if (requirements.length > prevCount.current) {
      document.getElementById(`req-${requirements.length - 1}`)?.focus();
    }
    prevCount.current = requirements.length;
  }, [requirements.length]);

  return (
    <div className="space-y-2">
      <SectionLabel>Requirements</SectionLabel>

      {isEmpty ? (
        <>
          <AddPointEmptyState
            compact
            message="No requirements yet. Add the skills or experience you need."
            onAdd={handleAddPoint}
            hasError={Boolean(errors?.[0])}
          />
          {errors?.[0] && (
            <p className="text-xs text-red-500" role="alert">
              {errors[0]}
            </p>
          )}
        </>
      ) : (
        <div className="mt-3 space-y-3">
          {requirements.map((requirement, index) => {
            const itemError = errors?.[index];

            return (
              <div key={`req-${index}`} className="space-y-1">
                <div className="flex items-center gap-2">
                  <Input
                    id={`req-${index}`}
                    placeholder="What skills are you looking for?"
                    value={requirement}
                    onChange={(e) => {
                      const next = [...requirements];
                      next[index] = e.target.value;
                      onUpdate(next);
                    }}
                    aria-invalid={Boolean(itemError)}
                    className={`h-11 flex-1 rounded-lg border bg-[#f8fafc] px-4 text-sm font-medium text-[#364153] placeholder:text-[#c8d6e5] focus-visible:ring-2 ${
                      itemError
                        ? "border-red-500 ring-2 ring-red-200 focus-visible:border-red-500 focus-visible:ring-red-500"
                        : "border-transparent focus-visible:border-transparent focus-visible:ring-blue-500/45"
                    }`}
                  />
                  <IconButton
                    ariaLabel={`Remove requirement ${index + 1}`}
                    icon={<Trash2 className="size-4 text-red-500" />}
                    onClick={() => onRemovePoint(index)}
                    className="border"
                  />
                </div>
                {itemError && (
                  <p className="text-xs text-red-500">{itemError}</p>
                )}
              </div>
            );
          })}

          <AddAnotherPointButton
            onAdd={handleAddPoint}
            disabled={lastIsEmpty}
          />
        </div>
      )}
    </div>
  );
}
