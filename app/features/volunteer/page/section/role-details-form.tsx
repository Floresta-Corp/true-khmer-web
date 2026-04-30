import { Clock3 } from "lucide-react";
import { Input } from "~/components/ui/input";
import type { VolunteerRoleErrors } from "../volunteer-post-page-2";

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

interface PaleInputProps {
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  ariaInvalid?: boolean;
  autoFocus?: boolean;
}

function PaleInput({
  autoFocus = false,
  placeholder,
  type = "text",
  value,
  onChange,
  className = "",
  ariaInvalid = false,
}: PaleInputProps) {
  return (
    <Input
      autoFocus={autoFocus}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.value)
      }
      aria-invalid={ariaInvalid}
      className={`h-11 rounded-lg border border-transparent bg-[#f8fafc] px-4 text-sm font-medium text-[#364153] placeholder:text-[#c8d6e5] ${className}`}
    />
  );
}

interface RoleDetailsFormProps {
  title: string;
  commitmentLabel: string;
  capacity: number;
  errors?: VolunteerRoleErrors;
  onTitleChange: (value: string) => void;
  onCommitmentChange: (value: string) => void;
  onCapacityChange: (value: number) => void;
}

export default function RoleDetailsForm({
  title,
  commitmentLabel,
  capacity,
  errors,
  onTitleChange,
  onCommitmentChange,
  onCapacityChange,
}: RoleDetailsFormProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="space-y-2">
        <SectionLabel>Role title</SectionLabel>
        <PaleInput
          autoFocus
          placeholder="e.g., Field Researcher"
          value={title}
          onChange={onTitleChange}
          ariaInvalid={Boolean(errors?.title)}
        />
        {errors?.title && (
          <p className="text-xs text-red-500">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <SectionLabel>Commitment</SectionLabel>
        <div className="relative">
          <Clock3 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#99a1af]" />
          <PaleInput
            placeholder="e.g., flexible"
            value={commitmentLabel}
            onChange={onCommitmentChange}
            ariaInvalid={Boolean(errors?.commitmentLabel)}
            className="pl-9"
          />
        </div>
        {errors?.commitmentLabel && (
          <p className="text-xs text-red-500">{errors.commitmentLabel}</p>
        )}
      </div>

      <div className="space-y-2">
        <SectionLabel>Capacity</SectionLabel>
        <PaleInput
          placeholder="1"
          type="number"
          value={String(capacity)}
          onChange={(value) =>
            onCapacityChange(Math.max(1, parseInt(value, 10) || 1))
          }
          ariaInvalid={Boolean(errors?.capacity)}
        />
        {errors?.capacity && (
          <p className="text-xs text-red-500">{errors.capacity}</p>
        )}
      </div>
    </div>
  );
}
