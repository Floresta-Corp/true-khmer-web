import { useState } from "react";
import { useLoaderData } from "react-router";
import { ShieldCheck } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { loader } from "../services/settings.loader";
import { action } from "../services/settings.action";
import { SidebarItem } from "../components/SidebarItem";
import { SecurityView } from "../components/SecurityView";
import { TwoFAView } from "../components/TwoFAView";

export { loader };
export { action };

export function meta() {
  return [{ title: "Account Settings | True Khmer" }];
}

type View = "security" | "2fa";

export default function SettingsPage() {
  const { email, twoFactor } = useLoaderData<typeof loader>();
  const [view, setView] = useState<View>("security");

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2233]">Settings</h1>
          <p className="text-sm text-[#6B7A99] mt-1">
            Update your personal information, photo, and privacy settings.
          </p>
        </div>

        <Card className="border border-[#E5EAF2] shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row min-h-130">
              <nav className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#E5EAF2] p-4 space-y-1 shrink-0">
                <SidebarItem
                  icon={<ShieldCheck className="size-4" />}
                  label="Account Security"
                  active
                />
                {/* Disable temporary */}
                {/* <SidebarItem icon={<Bell className="size-4" />} label="Notifications" />
                <SidebarItem icon={<Settings className="size-4" />} label="Preferences" /> */}
              </nav>
              <div className="flex-1 p-8">
                {view === "security" ? (
                  <SecurityView
                    email={email}
                    enabled={twoFactor.twoFactorEnabled}
                    onEdit2FA={() => setView("2fa")}
                  />
                ) : (
                  <TwoFAView
                    email={email}
                    settings={twoFactor}
                    onBack={() => setView("security")}
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
