import { useCallback, useState } from "react";
import { OAuthHeader } from "./oauth-header";
import { OAuthClientBranding } from "./oauth-client-branding";
import { OAuthScopeList } from "./oauth-scope-list";
import { OAuthTermsNotice } from "./oauth-terms-notice";
import { OAuthActionButtons } from "./oauth-action-buttons";
import { postAuthClose, postAuthResult } from "../lib/post-auth-result";
import type { OAuthSessionUser } from "../types";

interface OAuthConsentCardProps {
  clientName: string;
  origin: string;
  accessToken: string;
  user: OAuthSessionUser;
  onUseDifferentAccount: () => void;
}

export function OAuthConsentCard({
  clientName,
  origin,
  accessToken,
  user,
  onUseDifferentAccount,
}: OAuthConsentCardProps) {
  const [loading, setLoading] = useState(false);
  const handleContinue = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      postAuthResult(origin, { accessToken, user });
      setLoading(false);
    }, 1000);
  }, [accessToken, origin, user]);

  const handleCancel = useCallback(() => {
    postAuthClose(origin);
  }, [origin]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-100/70 p-4 font-sans text-slate-900">
      <div className="w-full max-w-105 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md">
        <OAuthHeader />

        <main className="space-y-5 p-6">
          <OAuthClientBranding clientName={clientName} />
          <OAuthScopeList user={user} />
          <div className="border-t border-slate-100 pt-2" />
          <OAuthTermsNotice clientName={clientName} />
          <OAuthActionButtons
            loading={loading}
            onCancel={handleCancel}
            onContinue={handleContinue}
          />
          <button
            type="button"
            onClick={onUseDifferentAccount}
            className="w-full text-center text-xs font-semibold text-blue-600 hover:underline"
          >
            Not {user.name}? Sign in with a different account
          </button>
        </main>
      </div>
    </div>
  );
}
