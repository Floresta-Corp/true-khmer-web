import type { ReactNode } from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const variants = {
  solid: "border-[#1c5dd4] bg-[#1c5dd4] text-white [a]:hover:bg-[#2f6fe4]",
  outline: "border-[#1c5dd4] bg-white text-[#1c5dd4] [a]:hover:bg-[#1c5dd4]/5",
};

type CampaignLinkButtonProps = {
  to: string;
  variant?: keyof typeof variants;
  className?: string;
  children: ReactNode;
};

export function CampaignLinkButton({
  to,
  variant = "solid",
  className,
  children,
}: CampaignLinkButtonProps) {
  return (
    <Button
      asChild
      className={cn(
        "h-11 w-full rounded-lg border px-5 text-sm font-medium sm:w-auto",
        variants[variant],
        className,
      )}
    >
      <Link to={to}>{children}</Link>
    </Button>
  );
}
