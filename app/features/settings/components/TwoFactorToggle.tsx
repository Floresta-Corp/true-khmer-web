import { ChevronRight } from "lucide-react";

export function TwoFactorToggle({
  enabled,
  onEditSettings,
}: {
  enabled: boolean;
  onEditSettings: () => void;
}) {
  return (
    <div className="flex flex-col items-end gap-2">
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
          enabled
            ? "bg-[#ECFDF3] text-[#027A48]"
            : "bg-[#F3F6FB] text-[#667085]"
        }`}
      >
        {enabled ? "Enabled" : "Disabled"}
      </span>
      <button
        type="button"
        onClick={onEditSettings}
        className="flex items-center gap-1 text-sm font-semibold text-[#2F6FE4] hover:underline"
      >
        Edit 2FA Settings
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
