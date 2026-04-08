import { Button } from "./ui/button";
import { cn } from "~/lib/utils";

interface IconButtonProps {
  className?: string;
  icon: React.ReactNode;

  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  ariaLabel?: string;
}

export default function IconButton({
  className,
  icon,
  onClick,
  disabled,
  ariaLabel = "Icon button",
}: IconButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "cursor-pointer size-8.75 rounded-[16px] border-0 bg-[#f8fafb] text-[#9eacc0] hover:bg-[#eff3f8] hover:text-[#65758b]",
        className,
      )}
    >
      {icon}
    </Button>
  );
}
