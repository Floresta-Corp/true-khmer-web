import { useState } from "react";
import { ChevronRight } from "lucide-react";

export function TwoFactorToggle({ onEditSettings }: { onEditSettings: () => void }) {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => setEnabled((p) => !p)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6FE4] focus-visible:ring-offset-2 ${
          enabled ? "bg-[#2F6FE4]" : "bg-[#D1D9E6]"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
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
