import { Button } from "~/components/ui/button";

interface OAuthActionButtonsProps {
  onCancel: () => void;
  onContinue: () => void;
  loading?: boolean;
  // A cancel that has to sign the session out first: neither button should
  // take another click while that is on its way.
  canceling?: boolean;
}

export function OAuthActionButtons({
  onCancel,
  onContinue,
  loading,
  canceling,
}: OAuthActionButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 pt-3 short:pt-1">
      <button
        type="button"
        onClick={onCancel}
        disabled={loading || canceling}
        className="h-11 w-full rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:ring-2 focus:ring-slate-200 focus:outline-none disabled:opacity-50 short:h-10"
      >
        Cancel
      </button>
      <Button
        loading={loading}
        disabled={canceling}
        type="button"
        onClick={onContinue}
        className="h-11 w-full rounded-full bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/50 focus:outline-none short:h-10"
      >
        Continue
      </Button>
    </div>
  );
}
