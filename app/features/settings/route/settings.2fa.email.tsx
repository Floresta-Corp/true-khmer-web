import { useOutletContext } from "react-router";
import { settings2faAction } from "../services/settings-2fa.action";
import { EmailOtpSetupView } from "../components/EmailOtpSetupView";
import type { SettingsOutletContext } from "../types";

export const action = settings2faAction;

export function meta() {
  return [{ title: "Set Up Email OTP | True Khmer" }];
}

export default function Settings2faEmailRoute() {
  const { email, twoFactor } = useOutletContext<SettingsOutletContext>();

  return (
    <EmailOtpSetupView
      email={twoFactor.methods.emailOtp.email || email}
      enabled={twoFactor.methods.emailOtp.enabled}
    />
  );
}
