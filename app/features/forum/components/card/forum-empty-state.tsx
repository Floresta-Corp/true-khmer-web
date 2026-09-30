import { Search } from "lucide-react";
import { Button } from "~/components/ui/button";

interface ForumEmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function ForumEmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: ForumEmptyStateProps) {
  return (
    <div className="flex min-h-96 items-center justify-center rounded-[18px] border border-dashed border-[#e5e7eb] bg-white px-6 py-12 text-center">
      <div className="flex max-w-sm flex-col items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-full border border-[#edf2f7] bg-[#fafbff] text-[#cbd5e1] shadow-[0px_6px_18px_rgba(15,23,42,0.04)]">
          <Search className="size-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-[#020618]">{title}</h3>
          <p className="text-sm leading-6 text-[#64748b]">{description}</p>
        </div>
        {actionLabel && onAction && (
          <Button
            type="button"
            variant="outline"
            onClick={onAction}
            className="h-10 rounded-full border-[#dbe3ee] bg-white px-5 text-sm font-semibold text-[#364153] shadow-[0px_4px_14px_rgba(15,23,42,0.04)] hover:bg-[#f8fafc]"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
