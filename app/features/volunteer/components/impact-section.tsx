import React from "react";

export default function ImpactSection({
  value,
  onChange,
  CustomTextarea,
}: {
  value: string;
  onChange: (value: string) => void;
  CustomTextarea: React.ComponentType<{
    placeholder: string;
    rows?: number;
    value: string;
    onChange: (value: string) => void;
    id?: string;
    hasError?: boolean;
  }>;
}) {
  return (
    <section className="rounded-2xl border border-[#E1E7EF] bg-white p-6">
      <h3 className="flex items-center gap-3 text-[22px] font-bold leading-8.25 text-[#344256]">
        Impact
      </h3>
      <div className="mt-3">
        <CustomTextarea
          placeholder="What change will volunteers help create?"
          rows={3}
          value={value}
          onChange={onChange}
        />
      </div>
    </section>
  );
}
