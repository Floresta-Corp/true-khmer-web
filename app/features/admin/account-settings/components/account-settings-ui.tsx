import {
  type ComponentProps,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { FieldErrors } from "./account-settings.validation";

/* ---------------------------------- styles --------------------------------- */

export const cardClass =
  "rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6";
export const inputClass =
  "h-12.5 rounded-[14px] bg-[#F8FAFC] dark:bg-slate-800 px-4.5 border-none text-sm text-[#364153] placeholder:text-[#C8D6E5] focus-visible:ring-2 focus-visible:ring-blue-500/45 focus-visible:border-transparent";
const errorInputClass =
  "border border-solid border-red-400 dark:border-red-500 focus-visible:ring-red-500/45 focus-visible:border-red-400";
export const labelClass =
  "block text-[11px] font-medium tracking-widest uppercase text-slate-400 mb-2";
const errorTextClass = "mt-1.5 text-xs text-red-500";
const submitButtonClass =
  "px-5 py-4 cursor-pointer rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed";

/* ------------------------------ useFieldErrors ----------------------------- */

/**
 * Mirrors server-side field errors into local state so a field's error can be
 * cleared the moment the user edits it (server props only refresh on submit).
 */
export function useFieldErrors(serverErrors?: FieldErrors) {
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    setErrors(serverErrors ?? {});
  }, [serverErrors]);

  const clearError = useCallback(
    (field: string) => setErrors((prev) => ({ ...prev, [field]: undefined })),
    [],
  );

  return { errors, setErrors, clearError };
}

/* ------------------------------- SettingsCard ------------------------------ */

const accentClasses = {
  blue: { wrap: "bg-blue-500/10", icon: "text-blue-500" },
  green: { wrap: "bg-green-500/10", icon: "text-green-500" },
} as const;

export function SettingsCard({
  icon: Icon,
  accent,
  title,
  children,
}: {
  icon: LucideIcon;
  accent: keyof typeof accentClasses;
  title: string;
  children: ReactNode;
}) {
  const { wrap, icon } = accentClasses[accent];
  return (
    <div className={cardClass}>
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${wrap}`}
        >
          <Icon size={15} className={icon} />
        </div>
        <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

/* -------------------------------- FormField -------------------------------- */

type FormFieldProps = {
  label: string;
  error?: string;
  onValueChange: (value: string) => void;
} & Omit<ComponentProps<typeof Input>, "onChange" | "className">;

export function FormField({
  label,
  error,
  onValueChange,
  id,
  name,
  ...inputProps
}: FormFieldProps) {
  const fieldId = id ?? name;
  return (
    <div>
      <Label htmlFor={fieldId} className={labelClass}>
        {label}
      </Label>
      <Input
        id={fieldId}
        name={name}
        onChange={(e) => onValueChange(e.target.value)}
        className={cn(inputClass, error && errorInputClass)}
        {...inputProps}
      />
      {error && <p className={errorTextClass}>{error}</p>}
    </div>
  );
}

/* --------------------------------- SaveBar --------------------------------- */

export function SaveBar({
  show,
  isPending,
  label,
  pendingLabel,
}: {
  show: boolean;
  isPending: boolean;
  label: string;
  pendingLabel: string;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: "auto", marginTop: 20 }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex justify-end overflow-hidden"
        >
          <Button type="submit" disabled={isPending} className={submitButtonClass}>
            {isPending ? pendingLabel : label}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
