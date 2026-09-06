import { Button } from "~/components/ui/button";

interface BuilderFooterProps {
  backLabel: string | null;
  continueLabel: string | null;
  showSubmit: boolean;
  busy: boolean;
  onBack: () => void;
  onSaveDraft: () => void;
  onContinue: () => void;
  onSubmit: () => void;
}

const OUTLINE =
  "h-auto rounded-lg border border-[#E5E7EB] bg-transparent px-[22px] py-3 text-sm font-bold text-[#333333] hover:bg-[#F9FAFC]";

/**
 * The sticky action bar under the step content: back on the left, save/continue
 * on the right, with Submit replacing Continue on the final step.
 */
export function BuilderFooter({
  backLabel,
  continueLabel,
  showSubmit,
  busy,
  onBack,
  onSaveDraft,
  onContinue,
  onSubmit,
}: BuilderFooterProps) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[#E5E7EB] px-6 py-[18px] sm:px-10">
      {backLabel ? (
        <Button
          type="button"
          variant="outline"
          className={OUTLINE}
          onClick={onBack}
          disabled={busy}
        >
          {backLabel}
        </Button>
      ) : (
        <div />
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className={OUTLINE}
          onClick={onSaveDraft}
          disabled={busy}
        >
          Save as draft
        </Button>

        {continueLabel && (
          <Button
            type="button"
            className="h-auto rounded-lg bg-[#1C5DD4] px-[22px] py-3 text-sm font-bold text-white hover:bg-[#174FB4]"
            onClick={onContinue}
            disabled={busy}
          >
            {continueLabel}
          </Button>
        )}

        {showSubmit && (
          <Button
            type="button"
            className="h-auto rounded-lg bg-[#1C5DD4] px-[22px] py-3 text-sm font-bold text-white hover:bg-[#174FB4]"
            onClick={onSubmit}
            disabled={busy}
          >
            Submit for review
          </Button>
        )}
      </div>
    </div>
  );
}
