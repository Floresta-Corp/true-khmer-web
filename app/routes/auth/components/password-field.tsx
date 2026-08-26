import { useState } from "react";
import type { ComponentType, InputHTMLAttributes, ReactNode } from "react";
import type { LucideProps } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "~/lib/utils";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";

type PasswordFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "id" | "type"
> & {
  id: string;
  label: ReactNode;
  icon?: ComponentType<LucideProps>;
  error?: string;
  showToggle?: boolean;
  wrapperClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  iconClassName?: string;
  toggleClassName?: string;
  errorClassName?: string;
};

export function PasswordField({
  id,
  label,
  icon: Icon,
  error,
  showToggle = true,
  wrapperClassName,
  labelClassName,
  inputClassName,
  iconClassName,
  toggleClassName,
  errorClassName,
  ...inputProps
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={cn("space-y-2", wrapperClassName)}>
      <Label
        htmlFor={id}
        className={cn(
          "block text-[13px] leading-[19.5px] font-semibold text-[#364153]",
          labelClassName,
        )}
      >
        {label}
      </Label>

      <div className="relative">
        {Icon ? (
          <Icon
            size={14}
            className={cn(
              "pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#D1D5DC]",
              iconClassName,
            )}
          />
        ) : null}

        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          className={cn(
            "h-11 rounded-lg border-transparent bg-[#F8FAFC] py-2 pr-10 pl-9 text-[12.25px] font-medium text-[#1E293B] placeholder:text-[#C8D6E5] focus-visible:ring-[#2F6FE4]/30",
            inputClassName,
          )}
          {...inputProps}
        />

        {showToggle ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowPassword((prev) => !prev)}
            className={cn(
              "absolute top-1/2 right-1.5 h-7 w-7 -translate-y-1/2 text-[#D1D5DC] hover:bg-transparent hover:text-[#94A3B8]",
              toggleClassName,
            )}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </Button>
        ) : null}
      </div>

      {error ? (
        <p className={cn("text-xs text-red-500", errorClassName)}>{error}</p>
      ) : null}
    </div>
  );
}
