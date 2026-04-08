import { Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";

interface ShareButtonProps {
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  ariaLabel?: string;
}

export default function ShareButton({
  className,
  onClick,
  disabled,
  ariaLabel = "Share",
}: ShareButtonProps) {
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
      <Share2 className="size-3.5" />
    </Button>
  );
}
