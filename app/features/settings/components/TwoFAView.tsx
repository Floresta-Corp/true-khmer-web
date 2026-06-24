import { useState } from "react";
import { ArrowLeft, ShieldCheck, MessageSquare } from "lucide-react";
import { TwoFAMethodCard } from "./TwoFAMethodCard";

export function TwoFAView({ onBack }: { onBack: () => void }) {
  const [appEnabled, setAppEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);

  return (
    <div className="space-y-8">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-[#6B7A99] hover:text-[#344256] transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Security
      </button>

      <div>
        <h2 className="text-2xl font-bold text-[#1A2233]">2FA Settings</h2>
        <p className="text-sm text-[#6B7A99] mt-1">
          Manage your two-factor authentication methods.
        </p>
      </div>

      <TwoFAMethodCard
        title="Authentication App"
        description="Use an app like Google Authenticator or Authy to generate codes."
        enabled={appEnabled}
        icon={
          <ShieldCheck
            className={`size-5 ${appEnabled ? "text-[#16A34A]" : "text-[#9CA3AF]"}`}
          />
        }
        onToggle={() => setAppEnabled((p) => !p)}
      />

      {/* Disabled temporary */}
      {/* <TwoFAMethodCard
        title="SMS Verification"
        description="Receive security codes via text message."
        enabled={smsEnabled}
        icon={<MessageSquare className="size-5 text-[#16A34A]" />}
        onToggle={() => setSmsEnabled((p) => !p)}
        setupLabel="Setup SMS"
      /> */}
    </div>
  );
}
