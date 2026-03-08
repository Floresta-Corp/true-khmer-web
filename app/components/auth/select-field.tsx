import type { ComponentType, ReactNode, SelectHTMLAttributes } from "react";
import type { LucideProps } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { cn } from "~/lib/utils";

type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> & {
  id: string;
  label: string;
  icon: ComponentType<LucideProps>;
  error?: string;
  children: ReactNode;
  wrapperClassName?: string;
  labelClassName?: string;
  selectClassName?: string;
  iconClassName?: string;
  chevronClassName?: string;
  errorClassName?: string;
};

export function SelectField({
  id,
  label,
  icon: Icon,
  error,
  children,
  wrapperClassName,
  labelClassName,
  selectClassName,
  iconClassName,
  chevronClassName,
  errorClassName,
  ...selectProps
}: SelectFieldProps) {
  return (
    <div className={cn("space-y-2", wrapperClassName)}>
      <label
        htmlFor={id}
        className={cn(
          "block text-[13px] font-semibold leading-[19.5px] text-[#364153]",
          labelClassName,
        )}
      >
        {label}
      </label>

      <div className="relative">
        <Icon
          size={14}
          className={cn(
            "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#D1D5DC]",
            iconClassName,
          )}
        />

        <select
          id={id}
          className={cn(
            "h-11 w-full appearance-none rounded-lg border border-transparent bg-[#F8FAFC] py-2 pl-9 pr-9 text-[12.25px] font-medium text-[#1E293B] outline-none",
            selectClassName,
          )}
          {...selectProps}
        >
          {children}
        </select>

        <ChevronDown
          size={14}
          className={cn(
            "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#D1D5DC]",
            chevronClassName,
          )}
        />
      </div>

      {error ? (
        <p className={cn("text-xs text-red-500", errorClassName)}>{error}</p>
      ) : null}
    </div>
  );
}
