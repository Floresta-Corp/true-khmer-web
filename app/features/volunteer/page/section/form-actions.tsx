import { Button } from "~/components/ui/button";

interface FormActionsProps {
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function FormActions({
  onBack,
  onSubmit,
  isSubmitting,
}: FormActionsProps) {
  return (
    <div className="flex items-center justify-between border-t border-[#F3F4F6] pt-5 pb-5">
      <Button
        type="button"
        variant="outline"
        className="h-10 rounded-lg border-[#E1E7EF] px-6 text-sm font-medium text-[#1D283A]"
        onClick={onBack}
      >
        Back to details
      </Button>
      <Button
        type="button"
        className="h-10 cursor-pointer rounded-lg bg-[#2f6fe4] px-6 text-sm font-medium text-white hover:bg-[#245fca]"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Publishing..." : "Publish opportunity"}
      </Button>
    </div>
  );
}
