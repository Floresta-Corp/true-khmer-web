import { useCallback, useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { OAuthCardShell } from "./oauth-card-shell";
import { OAuthClientBranding } from "./oauth-client-branding";
import { OAuthScopeList } from "./oauth-scope-list";
import { OAuthTermsNotice } from "./oauth-terms-notice";
import { OAuthActionButtons } from "./oauth-action-buttons";
import { OAuthSwitchAccountDialog } from "./oauth-switch-account-dialog";
import { postAuthClose, postAuthResult } from "../lib/post-auth-result";
import type {
  OauthHandoffAction,
  OAuthHandoffTokens,
} from "../services/oauth-handoff.action";
import type { OAuthSessionUser } from "../types";

interface OAuthConsentCardProps {
  clientName: string | null;
  clientLogo: string | null;
  clientId: string | null;
  origin: string;
  platform: "web" | "native";
  redirectUri: string | null;
  state: string | null;
  accessToken: string;
  user: OAuthSessionUser;
  // The user confirmed switching accounts and the sign-out has already gone
  // through; the session this card was offering no longer exists.
  onSignedOut: () => void;
  // The handoff had to refresh the pair before the SSO service would accept it.
  onTokensRefreshed: (tokens: OAuthHandoffTokens) => void;
  // Neither token was any good and the session has been cleared server-side.
  onSessionExpired: () => void;
}

export function OAuthConsentCard({
  clientName,
  clientLogo,
  clientId,
  origin,
  platform,
  redirectUri,
  state,
  accessToken,
  user,
  onSignedOut,
  onTokensRefreshed,
  onSessionExpired,
}: OAuthConsentCardProps) {
  const fetcher = useFetcher<typeof OauthHandoffAction>();
  const [error, setError] = useState<string | null>(null);
  const loading = fetcher.state !== "idle";
  const wasPending = useRef(false);

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
    const settled = wasPending.current && fetcher.state === "idle";
    wasPending.current = fetcher.state !== "idle";
    if (!settled) return;

    // A thrown Response or a network failure resolves the fetcher back to idle
    // with no data at all, so the missing-data case has to fail loudly too.
    if (fetcher.data?.ok) {
      if (fetcher.data.tokens) onTokensRefreshed(fetcher.data.tokens);
      postAuthResult(
        {
          origin: fetcher.data.origin ?? origin,
          platform,
          redirectUri,
          state,
        },
        fetcher.data,
      );
      return;
    }

    // The SSO service rejected both tokens and the server has already cleared
    // the session, so forget this account and drop back to the login form
    // instead of showing an error the user cannot act on.
    if (fetcher.data?.sessionExpired) {
      onSessionExpired();
      return;
    }

    setError("Unable to complete sign-in. Please try again.");
  }, [
    fetcher.state,
    fetcher.data,
    origin,
    platform,
    redirectUri,
    state,
    onTokensRefreshed,
    onSessionExpired,
  ]);

  const handleCancel = useCallback(() => {
    postAuthClose({ origin, platform, redirectUri, state });
  }, [origin, platform, redirectUri, state]);

  return (
    <OAuthCardShell>
      {clientName && (
        <OAuthClientBranding clientName={clientName} clientLogo={clientLogo} />
      )}
      <OAuthScopeList user={user} />
      <div className="border-t border-slate-100 pt-2 short:pt-0" />
      <OAuthTermsNotice clientName={clientName} />
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
      <OAuthActionButtons
        loading={loading}
        onCancel={handleCancel}
        onContinue={handleContinue}
      />
      <OAuthSwitchAccountDialog
        userName={user.name}
        onSignedOut={onSignedOut}
      />
    </OAuthCardShell>
  );
}
