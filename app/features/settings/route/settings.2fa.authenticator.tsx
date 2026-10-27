import { useOutletContext } from "react-router";
import { settings2faAction } from "../services/settings-2fa.action";
import { AuthenticatorSetupView } from "../components/AuthenticatorSetupView";
import type { SettingsOutletContext } from "../types";

export const action = settings2faAction;

export function meta() {
  return [{ title: "Set Up Authenticator App | True Khmer" }];
}

export default function Settings2faAuthenticatorRoute() {
  const { twoFactor } = useOutletContext<SettingsOutletContext>();

  return (
    <AuthenticatorSetupView
      enabled={twoFactor.methods.authenticatorApp.enabled}
    />
  );
}
