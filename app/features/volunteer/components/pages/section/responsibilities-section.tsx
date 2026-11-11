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

interface ResponsibilitiesSectionProps {
  responsibilities: string[];
  errors?: string[];
  onUpdate: (responsibilities: string[]) => void;
  onRemovePoint: (index: number) => void;
}

export default function ResponsibilitiesSection({
  responsibilities,
  errors,
  onUpdate,
  onRemovePoint,
}: ResponsibilitiesSectionProps) {
  const isEmpty = responsibilities.length === 0;
  const lastIsEmpty =
    responsibilities[responsibilities.length - 1]?.trim() === "";

  const handleAddPoint = () => {
    onUpdate([...responsibilities, ""]);
  };

  // Put the cursor in a point as soon as it's added.
  const prevCount = useRef(responsibilities.length);
  useEffect(() => {
    if (responsibilities.length > prevCount.current) {
      document.getElementById(`resp-${responsibilities.length - 1}`)?.focus();
    }
    prevCount.current = responsibilities.length;
  }, [responsibilities.length]);

  return (
    <div className="space-y-2">
      <SectionLabel>Responsibilities</SectionLabel>

      {isEmpty ? (
        <>
          <AddPointEmptyState
            compact
            message="No responsibilities yet. Add what this person will do in the role."
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
          {responsibilities.map((responsibility, index) => {
            const itemError = errors?.[index];

            return (
              <div key={`resp-${index}`} className="space-y-1">
                <div className="flex items-center gap-2">
                  <Input
                    id={`resp-${index}`}
                    placeholder="What will this person do?"
                    value={responsibility}
                    onChange={(e) => {
                      const next = [...responsibilities];
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
                    ariaLabel={`Remove responsibility ${index + 1}`}
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
