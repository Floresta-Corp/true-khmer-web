import type { ButtonHTMLAttributes } from "react";
import { cn } from "~/lib/utils";

type GoogleButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function GoogleButton({ className, ...buttonProps }: GoogleButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-[46px] w-full items-center justify-center gap-2 rounded-[14px] border border-[#F3F4F6] bg-transparent text-[13px] font-semibold text-[#4A5565]",
        className,
      )}
      {...buttonProps}
    >
      <img
        src="/logos/google_logo.svg"
        width={16}
        height={16}
        alt="Google Logo"
      />
      Continue with Google
    </button>
  );
}
