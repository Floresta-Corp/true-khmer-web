import { useCallback, useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { OAuthHeader } from "./oauth-header";
import { OAuthClientBranding } from "./oauth-client-branding";
import { OAuthScopeList } from "./oauth-scope-list";
import { OAuthTermsNotice } from "./oauth-terms-notice";
import { OAuthActionButtons } from "./oauth-action-buttons";
import { postAuthClose, postAuthResult } from "../lib/post-auth-result";
import type { OauthHandoffAction } from "../services/oauth-handoff.action";
import type { OAuthSessionUser } from "../types";

interface OAuthConsentCardProps {
  clientName: string | null;
  clientLogo: string | null;
  clientId: string | null;
  origin: string;
  accessToken: string;
  user: OAuthSessionUser;
  onUseDifferentAccount: () => void;
}

export function OAuthConsentCard({
  clientName,
  clientLogo,
  clientId,
  origin,
  accessToken,
  user,
  onUseDifferentAccount,
}: OAuthConsentCardProps) {
  const fetcher = useFetcher<typeof OauthHandoffAction>();
  const [error, setError] = useState<string | null>(null);
  const loading = fetcher.state !== "idle";

  const handleContinue = useCallback(() => {
    setError(null);
    fetcher.submit(
      { origin, clientId, accessToken },
      {
        method: "post",
        action: "/oauth/handoff",
        encType: "application/json",
      },
    );
  }, [fetcher, origin, clientId, accessToken]);

  // The popup never hands the raw accessToken to the opener — it exchanges it
  // for a single-use handoff token first, then forwards that whole result.
  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;

    if (fetcher.data.ok) {
      postAuthResult(fetcher.data.origin ?? origin, fetcher.data);
    } else {
      setError("Unable to complete sign-in. Please try again.");
    }
  }, [fetcher.state, fetcher.data, origin]);

  const handleCancel = useCallback(() => {
    postAuthClose(origin);
  }, [origin]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-100/70 p-4 font-sans text-slate-900">
      <div className="w-full max-w-105 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md">
        <OAuthHeader />

        <main className="space-y-5 p-6">
          {clientName && (
            <OAuthClientBranding
              clientName={clientName}
              clientLogo={clientLogo}
            />
          )}
          <OAuthScopeList user={user} />
          <div className="border-t border-slate-100 pt-2" />
          <OAuthTermsNotice clientName={clientName} />
          {error ? <p className="text-xs text-red-500">{error}</p> : null}
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
