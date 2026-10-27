import { useOutletContext } from "react-router";
import { settingsAction } from "../services/settings.action";
import { SecurityView } from "../components/SecurityView";
import type { SettingsOutletContext } from "../types";

export const action = settingsAction;

export default function SettingsSecurityRoute() {
  const { email, setupNewPassword, twoFactor } =
    useOutletContext<SettingsOutletContext>();

  return (
    <SecurityView
      email={email}
      setupNewPassword={setupNewPassword}
      enabled={twoFactor.twoFactorEnabled}
    />
  );
}
