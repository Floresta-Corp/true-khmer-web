import { useState } from "react";
import { useActionData, useLoaderData } from "react-router";
import type { oauthLoginLoader } from "../../services/oauth-login.loader";
import type { OAuthLoginActionData } from "../../types";
import { OAuthConsentCard } from "../oauth-consent-card";
import { OAuthUnauthorized } from "../oauth-unauthorized";
import { OAuthOriginError } from "../oauth-origin-error";

export default function OAuthLoginPage() {
  const { originAllowed, hasSession, clientName, origin, user, accessToken } =
    useLoaderData<typeof oauthLoginLoader>();
  const actionData = useActionData<OAuthLoginActionData>();
  const [useDifferentAccount, setUseDifferentAccount] = useState(false);

  if (!originAllowed || !origin) {
    return <OAuthOriginError />;
  }

  const consentData = useDifferentAccount
    ? null
    : (actionData?.success ??
      (hasSession && user && accessToken ? { accessToken, user } : null));

  if (consentData) {
    return (
      <OAuthConsentCard
        clientName={clientName}
        origin={origin}
        accessToken={consentData.accessToken}
        user={consentData.user}
        onUseDifferentAccount={() => setUseDifferentAccount(true)}
      />
    );
  }

  return <OAuthUnauthorized clientName={clientName} />;
}
