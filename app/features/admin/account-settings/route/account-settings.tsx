import { accountSettingsLoader } from "../services/account-settings.loader";
import { accountSettingsAction } from "../services/account-settings.action";
import AccountSettingsPage from "../components/pages/account-settings-page";

export const loader = accountSettingsLoader;
export const action = accountSettingsAction;

export function meta() {
  return [{ title: "Account Settings | True Khmer Admin" }];
}

export default function AccountSettingsRoute() {
  return <AccountSettingsPage />;
}
