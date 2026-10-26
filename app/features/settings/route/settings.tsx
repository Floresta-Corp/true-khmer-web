import { settingsLoader } from "../services/settings.loader";
import SettingsPage from "../components/pages/settings-page";

export const loader = settingsLoader;

export function meta() {
  return [{ title: "Account Settings | True Khmer" }];
}

export default function SettingsRoute() {
  return <SettingsPage />;
}
