import { settingsLoader } from "../services/settings.loader";
import { settingsAction } from "../services/settings.action";
import SettingsPage from "../components/pages/settings-page";

export const loader = settingsLoader;
export const action = settingsAction;

export function meta() {
  return [{ title: "Account Settings | True Khmer" }];
}

export default function SettingsRoute() {
  return <SettingsPage />;
}
