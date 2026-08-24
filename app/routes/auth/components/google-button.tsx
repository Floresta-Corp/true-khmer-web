import type { ButtonHTMLAttributes } from "react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

type GoogleButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function GoogleButton({
  className,
  children = "Continue with Google",
  ...buttonProps
}: GoogleButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "h-12 w-full rounded-[14px] border-[#F3F4F6] bg-transparent text-[13px] font-semibold text-[#4A5565] hover:bg-[#F1F5F9] hover:text-[#364153]",
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
      {children}
    </Button>
  );
}
