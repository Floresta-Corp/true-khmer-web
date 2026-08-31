import { useCallback, useEffect, useState } from "react";
import { useActionData, useLoaderData } from "react-router";
import { toast } from "sonner";
import type { OauthLoginLoader } from "../../services/oauth-login.loader";
import type { OAuthHandoffTokens } from "../../services/oauth-handoff.action";
import type { OAuthLoginActionData } from "../../types";
import { useOAuthSessionStore } from "../../store/oauth-session.store";
import { OAuthConsentCard } from "../oauth-consent-card";
import { OAuthUnauthorized } from "../oauth-unauthorized";
import { OAuthOriginError } from "../oauth-origin-error";

const SESSION_EXPIRED_MESSAGE =
  "Your session has expired. Please sign in again to continue.";

export default function OAuthLoginPage() {
  const {
    originAllowed,
    hasSession,
    clientName,
    clientLogo,
    clientId,
    origin,
    platform,
    redirectUri,
    state,
    user,
    accessToken,
    refreshToken,
  } = useLoaderData<typeof OauthLoginLoader>();
  const actionData = useActionData<OAuthLoginActionData>();
  // The access token this page has stopped trusting: either the handoff came
  // back rejecting it, or the user signed out of it to switch accounts. Both
  // end with the server destroying `__session`, and both need this because
  // `actionData` outlives them — a login earlier in this same page's life keeps
  // reporting its success, which would put the card straight back up.
  //
  // Held as the token itself rather than a flag so a fresh login through the
  // form — which arrives as a different token — brings the consent card back on
  // its own; as a flag it would leave the user staring at the form they just
  // submitted successfully.
  const [discardedAccessToken, setDiscardedAccessToken] = useState<
    string | null
  >(null);
  const setSession = useOAuthSessionStore((state) => state.setSession);
  const clearSession = useOAuthSessionStore((state) => state.clearSession);

  // Either this page's own login, or a session that already exists in the
  // `__session` cookie — including one just created by the signup flow this
  // page navigated away to and came back from. Both carry the refresh token so
  // the handoff can trade an expired access token in rather than send the user
  // back through the login form.
  const storedSession =
    actionData?.success ??
    (hasSession && user && accessToken
      ? { accessToken, refreshToken, user }
      : null);

  const consentData =
    storedSession && storedSession.accessToken !== discardedAccessToken
      ? storedSession
      : null;

  useEffect(() => {
    if (consentData) setSession(consentData);
  }, [consentData, setSession]);

  // The handoff had to refresh before the SSO service would accept the pair.
  // The server already wrote it into `__session`; this keeps the page's own
  // copy of the credentials on the same tokens.
  const handleTokensRefreshed = useCallback(
    (tokens: OAuthHandoffTokens) => {
      if (consentData) setSession({ ...tokens, user: consentData.user });
    },
    [consentData, setSession],
  );

  // Neither token was any good and the server has destroyed the `__session`
  // cookie; drop this page's copy too, so the login form is the only way on.
  // The card the user was looking at is replaced by that form, so say why —
  // otherwise the consent step they just approved silently becomes a login.
  const handleSessionExpired = useCallback(() => {
    clearSession();
    setDiscardedAccessToken(storedSession?.accessToken ?? null);
    toast.error(SESSION_EXPIRED_MESSAGE);
  }, [clearSession, storedSession?.accessToken]);

  // The user confirmed switching accounts, and the action has already destroyed
  // `__session`. Forget the credentials here too — the login form is the only
  // way on from here, with no way back to a card whose account is signed out.
  const handleSignedOut = useCallback(() => {
    clearSession();
    setDiscardedAccessToken(storedSession?.accessToken ?? null);
  }, [clearSession, storedSession?.accessToken]);

  if (!originAllowed || !origin) {
    return <OAuthOriginError />;
  }

  if (consentData) {
    return (
      <OAuthConsentCard
        clientName={clientName}
        clientLogo={clientLogo}
        clientId={clientId}
        origin={origin}
        platform={platform}
        redirectUri={redirectUri}
        state={state}
        accessToken={consentData.accessToken}
        user={consentData.user}
        onSignedOut={handleSignedOut}
        onTokensRefreshed={handleTokensRefreshed}
        onSessionExpired={handleSessionExpired}
      />
    );
  }

  return <OAuthUnauthorized clientName={clientName} clientLogo={clientLogo} />;
}
