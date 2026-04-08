import {
  Bell,
  Briefcase,
  Compass,
  LayoutDashboard,
  MessageSquare,
  Rocket,
  Settings,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";

type SidebarItem = {
  id: string;
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
};

const primaryItems: SidebarItem[] = [
  { id: "overview", label: "Overview", to: "/myspace", icon: LayoutDashboard },
  { id: "journey", label: "My Journey", to: "/dashboard", icon: Compass },
  {
    id: "opportunities",
    label: "Opportunities",
    to: "/volunteer",
    icon: Briefcase,
  },
  { id: "launchpad", label: "Launchpad", to: "/launchpad", icon: Rocket },
  {
    id: "messages",
    label: "Messages",
    to: "/forum",
    icon: MessageSquare,
    badge: 3,
  },
];

const utilityItems: SidebarItem[] = [
  { id: "notifications", label: "Notifications", to: "/myspace", icon: Bell },
  { id: "settings", label: "Settings", to: "/profile", icon: Settings },
];

const statCards = [
  { label: "Contributions", value: "24" },
  { label: "Badges", value: "08" },
];

export default function MySpaceSideBar() {
  const location = useLocation();
  const [activeId, setActiveId] = useState<string>("overview");

  const isActive = (item: SidebarItem) =>
    location.pathname === item.to || activeId === item.id;

  return (
    <Sidebar
      variant="sidebar"
      collapsible="none"
      className="border-r border-[#F3F4F6] bg-white lg:flex"
    >
      <SidebarHeader className="p-5">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border border-[#f1f5f9]">
            <AvatarImage src="/romdoul.svg" alt="User avatar" />
            <AvatarFallback>TK</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#141414]">
              Khmer Builder
            </p>
            <p className="truncate text-xs text-[#9eacc0]">@myspace</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="space-y-5 p-5 pt-0">
          <div className="grid grid-cols-2 gap-2">
            {statCards.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-[#f1f5f9] bg-[#f8fafc] p-2.5"
              >
                <p className="text-[11px] font-medium text-[#9eacc0]">
                  {stat.label}
                </p>
                <p className="text-sm font-semibold text-[#344256]">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <SidebarSeparator className="bg-[#f1f5f9]" />

          <SidebarMenu className="space-y-1.5">
            {primaryItems.map((item) => {
              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item)}
                    className={cn(
                      "h-9 justify-between rounded-lg px-2.5 text-sm font-medium",
                      isActive(item)
                        ? "bg-[#2f6fe4]/10 text-[#2f6fe4] hover:bg-[#2f6fe4]/15"
                        : "text-[#344256] hover:bg-[#f8fafc]",
                    )}
                  >
                    <Link to={item.to} onClick={() => setActiveId(item.id)}>
                      <span className="inline-flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                  {item.badge ? (
                    <SidebarMenuBadge className="h-5 min-w-5 rounded-md bg-[#2f6fe4] px-1 text-[10px] text-white">
                      {item.badge}
                    </SidebarMenuBadge>
                  ) : null}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>

          <SidebarSeparator className="bg-[#f1f5f9]" />

          <SidebarMenu className="space-y-1.5">
            {utilityItems.map((item) => {
              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item)}
                    className={cn(
                      "h-9 rounded-lg px-2.5 text-sm font-medium",
                      isActive(item)
                        ? "bg-[#2f6fe4]/10 text-[#2f6fe4] hover:bg-[#2f6fe4]/15"
                        : "text-[#344256] hover:bg-[#f8fafc]",
                    )}
                  >
                    <Link to={item.to} onClick={() => setActiveId(item.id)}>
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-5 pt-0">
        <Button className="h-10 w-full rounded-lg bg-[#2f6fe4] text-sm font-medium text-white hover:bg-[#245fca]">
          <Sparkles className="h-4 w-4" />
          Boost my profile
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
