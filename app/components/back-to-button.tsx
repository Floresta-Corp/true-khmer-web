import { ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { cn } from "~/lib/utils";

interface BackToButtonProps {
  text?: string;
  /** A path, or a history delta such as -1 to go back. */
  to: string | number;
  /** Where to go when `to` is a delta but there's no history to go back to. */
  fallback?: string;
  className?: string;
}

export default function BackToButton({
  text,
  to,
  fallback = "/",
  className,
}: BackToButtonProps) {
  const navigate = useNavigate();
  const goBack = () => {
    if (typeof to === "string") {
      navigate(to);
      return;
    }
    // React Router keeps the in-app history index on history.state.idx; a
    // visitor who landed here directly has nothing in-app to go back to.
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) {
      navigate(to);
    } else {
      navigate(fallback, { replace: true });
    }
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
