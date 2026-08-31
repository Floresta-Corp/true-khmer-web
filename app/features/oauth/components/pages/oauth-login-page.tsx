import { useEffect, useState } from "react";
import { useActionData, useLoaderData } from "react-router";
import type { OauthLoginLoader } from "../../services/oauth-login.loader";
import type { OAuthLoginActionData } from "../../types";
import { useOAuthSessionStore } from "../../store/oauth-session.store";
import { OAuthConsentCard } from "../oauth-consent-card";
import { OAuthUnauthorized } from "../oauth-unauthorized";
import { OAuthOriginError } from "../oauth-origin-error";

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
  } = useLoaderData<typeof OauthLoginLoader>();
  const actionData = useActionData<OAuthLoginActionData>();
  const [useDifferentAccount, setUseDifferentAccount] = useState(false);
  const setSession = useOAuthSessionStore((state) => state.setSession);

  const consentData = useDifferentAccount
    ? null
    : (actionData?.success ??
      (hasSession && user && accessToken ? { accessToken, user } : null));

  useEffect(() => {
    if (consentData) setSession(consentData);
  }, [consentData, setSession]);

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
        onUseDifferentAccount={() => setUseDifferentAccount(true)}
      />
    );
  }

  return <OAuthUnauthorized clientName={clientName} clientLogo={clientLogo} />;
}
