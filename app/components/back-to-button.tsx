import { ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { cn } from "~/lib/utils";

interface BackToButtonProps {
  text?: string;
  to: string;
  className?: string;
}

export default function BackToButton({
  text,
  to,
  className,
}: BackToButtonProps) {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(to);
  };

  return (
    <Button
      variant="link"
      onClick={goBack}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 p-0 text-[13px] font-semibold text-blue-600 transition-colors hover:text-[#2f6fe4]",
        className,
      )}
    >
      <ChevronLeft className="h-4.5 w-4.5" />
      {text ?? "Back"}
    </Button>
  );
}
