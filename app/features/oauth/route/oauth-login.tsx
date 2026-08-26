import { OauthLoginLoader } from "../services/oauth-login.loader";
import { OauthLoginAction } from "../services/oauth-login.action";
import OAuthLoginPage from "../components/pages/oauth-login-page";

export const loader = OauthLoginLoader;
export const action = OauthLoginAction;

export function meta() {
  return [{ title: "Sign In - True Khmer Account" }];
}

export default function OAuthLoginRoute() {
  return <OAuthLoginPage />;
}
