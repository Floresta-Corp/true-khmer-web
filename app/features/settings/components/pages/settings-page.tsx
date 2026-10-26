import { Outlet, useLoaderData } from "react-router";
import { ShieldCheck } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { SidebarItem } from "../SidebarItem";
import type { settingsLoader } from "../../services/settings.loader";
import type { SettingsOutletContext } from "../../types";

export default function SettingsPage() {
  const { email, setupNewPassword, twoFactor } =
    useLoaderData<typeof settingsLoader>();

  return (
    <div className="min-h-screen bg-[#F5F7FA] px-4 pt-10 pb-24 sm:px-6 md:pb-10 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2233]">Settings</h1>
          <p className="mt-1 text-sm text-[#6B7A99]">
            Update your personal information, photo, and privacy settings.
          </p>
        </div>

        <Card className="overflow-hidden rounded-2xl border border-[#E5EAF2] shadow-sm">
          <CardContent className="p-0">
            <div className="flex min-h-130 flex-col md:flex-row">
              <nav className="w-full shrink-0 space-y-1 border-b border-[#E5EAF2] p-4 md:w-64 md:border-r md:border-b-0">
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
                <Outlet
                  context={
                    {
                      email,
                      setupNewPassword,
                      twoFactor,
                    } satisfies SettingsOutletContext
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
