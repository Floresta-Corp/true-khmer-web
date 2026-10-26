import { useOutletContext } from "react-router";
import { settings2faAction } from "../services/settings-2fa.action";
import { TwoFAView } from "../components/TwoFAView";
import type { SettingsOutletContext } from "../types";

export const action = settings2faAction;

export function meta() {
  return [{ title: "2-Step Verification | True Khmer" }];
}

export default function Settings2faRoute() {
  const { email, setupNewPassword, twoFactor } =
    useOutletContext<SettingsOutletContext>();

  return (
    <TwoFAView
      email={email}
      setupNewPassword={setupNewPassword}
      settings={twoFactor}
    />
  );
}
