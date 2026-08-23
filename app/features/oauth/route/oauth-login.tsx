import { oauthLoginLoader } from "../services/oauth-login.loader";
import { oauthLoginAction } from "../services/oauth-login.action";
import OAuthLoginPage from "../components/pages/oauth-login-page";

export const loader = oauthLoginLoader;
export const action = oauthLoginAction;

export function meta() {
  return [{ title: "Sign In - True Khmer Account" }];
}

export default function OAuthLoginRoute() {
  return <OAuthLoginPage />;
}
