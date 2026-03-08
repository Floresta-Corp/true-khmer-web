import type { ComponentType, InputHTMLAttributes } from "react";
import type { LucideProps } from "lucide-react";
import { cn } from "~/lib/utils";

type InputFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id: string;
  label: string;
  icon: ComponentType<LucideProps>;
  error?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  iconClassName?: string;
  errorClassName?: string;
};

export function InputField({
  id,
  label,
  icon: Icon,
  error,
  wrapperClassName,
  labelClassName,
  inputClassName,
  iconClassName,
  errorClassName,
  ...inputProps
}: InputFieldProps) {
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
        <input
          id={id}
          className={cn(
            "h-11 w-full rounded-lg border border-transparent bg-[#F8FAFC] py-2 pl-9 pr-3 text-[12.25px] font-medium text-[#1E293B] outline-none placeholder:text-[#C8D6E5]",
            inputClassName,
          )}
          {...inputProps}
        />
      </div>

      {error ? (
        <p className={cn("text-xs text-red-500", errorClassName)}>{error}</p>
      ) : null}
    </div>
  );
}
