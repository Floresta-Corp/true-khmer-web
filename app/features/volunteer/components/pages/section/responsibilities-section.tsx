import { Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import IconButton from "~/components/icon-button";
import { Input } from "~/components/ui/input";

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
  const lastIsEmpty =
    responsibilities[responsibilities.length - 1]?.trim() === "";

  const handleAddPoint = () => {
    onUpdate([...responsibilities, ""]);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <SectionLabel>Responsibilities</SectionLabel>
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
        {responsibilities.map((responsibility, index) => {
          const itemError = errors?.[index];

          return (
            <div key={`resp-${index}`} className="space-y-1">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="What will this person do?"
                  value={responsibility}
                  onChange={(e) => {
                    const newResponsibilities = [...responsibilities];
                    newResponsibilities[index] = e.target.value;
                    onUpdate(newResponsibilities);
                  }}
                  aria-invalid={Boolean(itemError)}
                  className={`h-11 flex-1 rounded-lg border bg-[#f8fafc] px-4 text-sm font-medium text-[#364153] placeholder:text-[#c8d6e5] focus-visible:ring-2 ${
                    itemError
                      ? "border-red-500 ring-2 ring-red-200 focus-visible:border-red-500 focus-visible:ring-red-500"
                      : "border-transparent focus-visible:border-transparent focus-visible:ring-blue-500/45"
                  }`}
                />
                {responsibilities.length > 1 && (
                  <IconButton
                    ariaLabel={`Remove responsibility ${index + 1}`}
                    icon={<Trash2 className="size-4 text-red-500" />}
                    onClick={() => onRemovePoint(index)}
                    className="border"
                  />
                )}
              </div>
              {itemError && <p className="text-xs text-red-500">{itemError}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
