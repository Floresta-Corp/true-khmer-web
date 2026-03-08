import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "~/lib/utils";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function PrimaryButton({
  children,
  className,
  disabled,
  ...buttonProps
}: PrimaryButtonProps) {
  return (
    <button
      className={cn(
        "flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium transition-colors",
        disabled
          ? "cursor-not-allowed bg-[#F1F5F9] text-[#0F172B] opacity-50"
          : "bg-[#2F6FE4] text-white",
        className,
      )}
      disabled={disabled}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
