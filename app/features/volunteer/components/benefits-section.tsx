import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Award, Trash2 } from "lucide-react";
import IconButton from "~/components/icon-button";
import {
  AddAnotherPointButton,
  AddPointEmptyState,
} from "./add-point-controls";
import { MAX_BENEFIT_LENGTH, MAX_BENEFITS } from "../lib/volunteer-validation";

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
    maxLength?: number;
  }>;
  benefitErrors?: string[];
}) {
  const atLimit = benefits.length >= MAX_BENEFITS;
  const isEmpty = benefits.length === 0;
  const listError =
    isEmpty && benefitErrors?.length === 1 ? benefitErrors[0] : undefined;

  // Move focus into a point the moment it's added, so "Add point" reads as
  // "start typing here" rather than leaving the user to hunt for the field.
  const prevCount = useRef(benefits.length);
  useEffect(() => {
    if (benefits.length > prevCount.current) {
      const last = benefits[benefits.length - 1];
      document.getElementById(`benefit-${last.id}`)?.focus();
    }
    prevCount.current = benefits.length;
  }, [benefits]);

  return (
    <section className="rounded-2xl border border-[#E1E7EF] bg-white p-6">
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-3 text-lg leading-8.25 font-bold text-[#344256] sm:text-[22px]">
          Benefits
        </h3>
        {!isEmpty && (
          <span className="shrink-0 text-xs font-medium text-slate-400 tabular-nums">
            {benefits.length}/{MAX_BENEFITS}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-slate-400">
        {atLimit
          ? `You've reached the limit of ${MAX_BENEFITS} benefits.`
          : `What volunteers get out of this. Add up to ${MAX_BENEFITS} points, ${MAX_BENEFIT_LENGTH} characters each.`}
      </p>

      {isEmpty ? (
        <div className="mt-4">
          <AddPointEmptyState
            icon={Award}
            message="No benefits yet. Add points like a certificate, mentorship or new skills volunteers will gain."
            onAdd={onAdd}
            hasError={Boolean(listError)}
          />
        </div>
      ) : (
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
                      maxLength={MAX_BENEFIT_LENGTH}
                    />
                    <div className="mt-1 flex items-start justify-between gap-2">
                      {benefitErrors && benefitErrors[idx] ? (
                        <p
                          id={`benefit-${benefit.id}-error`}
                          className="text-xs text-red-500"
                        >
                          {benefitErrors[idx]}
                        </p>
                      ) : (
                        <span />
                      )}
                      <span className="shrink-0 text-xs text-slate-400 tabular-nums">
                        {benefit.value.length}/{MAX_BENEFIT_LENGTH}
                      </span>
                    </div>
                  </div>
                  <IconButton
                    ariaLabel={`Remove benefit ${idx + 1}`}
                    icon={<Trash2 className="size-4 text-red-500" />}
                    onClick={() => onRemove(benefit.id)}
                    className="border"
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {!atLimit && <AddAnotherPointButton onAdd={onAdd} />}
        </div>
      )}

      {listError ? (
        <p className="mt-2 text-xs text-red-500" role="alert">
          {listError}
        </p>
      ) : null}
    </section>
  );
}
