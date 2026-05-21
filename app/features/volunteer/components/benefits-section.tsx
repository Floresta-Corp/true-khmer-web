import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Trash2 } from "lucide-react";
import IconButton from "~/components/icon-button";
import { Button } from "~/components/ui/button";

type Benefit = { id: number; value: string };

export default function BenefitsSection({
  benefits,
  onAdd,
  onChange,
  onRemove,
  CustomTextarea,
  benefitErrors,
}: {
  benefits: Benefit[];
  onAdd: () => void;
  onChange: (id: number, value: string) => void;
  onRemove: (id: number) => void;
  CustomTextarea: React.ComponentType<{
    placeholder: string;
    rows?: number;
    value: string;
    onChange: (value: string) => void;
    id?: string;
    hasError?: boolean;
  }>;
  benefitErrors?: string[];
}) {
  return (
    <section className="rounded-2xl border border-[#E1E7EF] bg-white p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="flex items-center gap-3 text-[22px] font-bold leading-8.25 text-[#344256]">
          Benefits <span className="text-red-600">*</span>
        </h3>
        <Button
          type="button"
          variant="ghost"
          className="h-auto px-0 py-0 text-xs font-semibold leading-4.5 text-[#2F6FE4] hover:text-[#245fca]"
          onClick={onAdd}
        >
          + Add point
        </Button>
      </div>

      <div className="mt-3 space-y-3">
        <AnimatePresence mode="popLayout">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={benefit.id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="space-y-1"
            >
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <CustomTextarea
                    placeholder="e.g., Certificate of completion, networking, skill development"
                    rows={2}
                    value={benefit.value}
                    onChange={(value) => onChange(benefit.id, value)}
                    id={`benefit-${benefit.id}`}
                    hasError={Boolean(benefitErrors && benefitErrors[idx])}
                  />
                  {benefitErrors && benefitErrors[idx] ? (
                    <p id={`benefit-${benefit.id}-error`} className="mt-1 text-xs text-red-500">
                      {benefitErrors[idx]}
                    </p>
                  ) : null}
                </div>
                {benefits.length > 1 && (
                  <IconButton
                    ariaLabel={`Remove benefit row ${benefit.id}`}
                    icon={<Trash2 className="size-4 text-red-500" />}
                    onClick={() => onRemove(benefit.id)}
                    className="border"
                  />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {benefitErrors &&
        benefitErrors.length === 1 &&
        benefits.length === 0 ? (
          <p className="mt-2 text-xs text-red-500">{benefitErrors[0]}</p>
        ) : null}
      </div>
    </section>
  );
}
