import { ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";

interface BackToButtonProps {
  text?: string;
  to: string;
}

export default function BackToButton({ text, to }: BackToButtonProps) {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(to);
    }
  };
  return (
    <Button
      variant="link"
      onClick={goBack}
      className="cursor-pointer inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors hover:text-[#2f6fe4] text-blue-600"
    >
      <ChevronLeft className="h-4.5 w-4.5" />
      {text ?? "Back"}
    </Button>
  );
}
