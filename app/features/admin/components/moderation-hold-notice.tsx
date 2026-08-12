import { EyeOff } from "lucide-react";

interface ModerationHoldNoticeProps {
  /** The thing on hold, lowercase: "opportunity", "project", "question". */
  noun: string;
  /** Who can still see it and what is blocked, e.g. "Only its poster can see it, and nobody can apply." */
  visibility: string;
  reason: string | null;
}

/**
 * Banner shown at the top of a suspended item's detail page. The reason comes
 * from the moderator who suspended it and may be absent on older records, so
 * the copy falls back rather than rendering a dangling "Reason:".
 */
export default function ModerationHoldNotice({
  noun,
  visibility,
  reason,
}: ModerationHoldNoticeProps) {
  return (
    <div className="flex items-start gap-2.5 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 dark:border-orange-500/30 dark:bg-orange-500/10">
      <EyeOff
        size={16}
        className="mt-0.5 shrink-0 text-orange-600 dark:text-orange-400"
      />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">
          This {noun} is on moderation hold
        </p>
        <p className="mt-0.5 text-xs text-orange-700/80 dark:text-orange-400/80">
          {visibility}{" "}
          {reason ? `Reason: ${reason}` : "No reason was recorded."}
        </p>
      </div>
    </div>
  );
}
