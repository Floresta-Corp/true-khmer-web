import { Oauth2faLoader } from "../services/oauth-2fa.loader";
import { Oauth2faAction } from "../services/oauth-2fa.action";
import OAuthTwoFactorPage from "../components/pages/oauth-two-factor-page";

export const loader = Oauth2faLoader;
export const action = Oauth2faAction;

export function meta() {
  return [{ title: "Verify Sign In - True Khmer Account" }];
}

export default function OAuthTwoFactorRoute() {
  return <OAuthTwoFactorPage />;
}
