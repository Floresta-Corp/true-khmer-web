import { Ban } from "lucide-react";
import { Button } from "~/components/ui/button";

export interface WithdrawCardProps {
  disabled: boolean;
  isSubmitting: boolean;
  onWithdraw: () => void;
}

export function WithdrawCard({
  disabled,
  isSubmitting,
  onWithdraw,
}: WithdrawCardProps) {
  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled || isSubmitting}
      onClick={onWithdraw}
      className="h-12 w-full rounded-2xl border-[#E7ECF3] bg-white text-sm font-medium text-[#5B687D] shadow-none transition-colors hover:bg-[#F8FAFC]"
    >
      <Ban className="mr-2 size-4" />
      {isSubmitting ? "Withdrawing..." : "Withdraw application"}
    </Button>
  );
}
