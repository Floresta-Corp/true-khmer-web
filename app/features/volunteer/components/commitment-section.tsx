import React from "react";
import { SingleSelectDropdown } from "~/components/ui/single-select-dropdown";

function CommitmentLabelSelect({
  value,
  onChange,
  ariaInvalid,
}: {
  value: string;
  onChange: (value: string) => void;
  ariaInvalid?: boolean;
}) {
  const options = [
    { value: "Light", label: "Light" },
    { value: "Regular", label: "Regular" },
    { value: "Intensive", label: "Intensive" },
  ];

  return (
    <SingleSelectDropdown
      id="commitmentLabel"
      value={value}
      onValueChange={onChange}
      options={options}
      placeholder="Select Commitment"
      ariaInvalid={ariaInvalid}
      triggerClassName="h-11 rounded-[14px] border border-[#E1E7EF] bg-[#F8FAFC] px-3 text-sm font-medium text-[#6A7282] shadow-none hover:bg-[#F8FAFC]"
    />
  );
}

export default function CommitmentSection({
  commitmentLabel,
  commitmentDescription,
  onChangeLabel,
  onChangeDescription,
  CustomTextarea,
  commitmentLabelError,
}: {
  commitmentLabel: string;
  commitmentDescription: string;
  onChangeLabel: (value: string) => void;
  onChangeDescription: (value: string) => void;
  CustomTextarea: React.ComponentType<{
    placeholder: string;
    rows?: number;
    value: string;
    onChange: (value: string) => void;
    id?: string;
    hasError?: boolean;
  }>;
  commitmentLabelError?: string;
}) {
  return (
    <section className="rounded-2xl border border-[#E1E7EF] bg-white p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="flex items-center gap-3 text-[22px] font-bold leading-8.25 text-[#344256]">
          Commitment
        </h3>
      </div>

      <div className="mt-3 space-y-4">
        <div className="w-full space-y-2">
          <label
            htmlFor="commitmentLabel"
            className="block text-sm font-medium text-[#344256]"
          >
            Commitment <span className="text-red-600">*</span>
          </label>
          <CommitmentLabelSelect
            value={commitmentLabel}
            onChange={onChangeLabel}
            ariaInvalid={Boolean(commitmentLabelError)}
          />
          {commitmentLabelError ? (
            <p className="text-xs text-red-500">{commitmentLabelError}</p>
          ) : null}
        </div>

        <div className="w-full space-y-2">
          <label
            htmlFor="commitmentDescription"
            className="block text-sm font-medium text-[#344256]"
          >
            Commitment Details
          </label>
          <CustomTextarea
            id="commitmentDescription"
            placeholder="e.g., expected weekly hours, on-site vs remote"
            rows={3}
            value={commitmentDescription}
            onChange={onChangeDescription}
          />
        </div>
      </div>
    </section>
  );
}
