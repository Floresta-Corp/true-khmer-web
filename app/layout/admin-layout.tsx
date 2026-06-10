import {
  Building2,
  LayoutDashboard,
  ShieldCheck,
  Users,
  Moon,
  Bell,
  ChevronDown,
} from "lucide-react";
import { Link, NavLink, Outlet } from "react-router";

export function meta() {
  return [{ title: "Admin Panel | True Khmer" }];
}
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarTrigger,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarMenu,
} from "~/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const user = {
  userRole: "Super Admin",
  name: "TK",
  avatar: "",
};

const nav = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/tk-admin",
    hide: false,
  },
  {
    icon: ShieldCheck,
    label: "Content Moderator",
    href: "/tk-admin/content-moderator",
    hide: false,
  },
  {
    icon: Users,
    label: "User management",
    href: "/tk-admin/users",
    hide: false,
  },
  { icon: Building2, label: "Partner", href: "/tk-admin/partner", hide: false },
];

export default function AdminLayout() {
  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#0a0e1a]">
      <SidebarProvider>
        <Sidebar
          collapsible="icon"
          variant="sidebar"
          className="border-r border-[#1a1f2e]"
        >
          <SidebarContent className="bg-[#0f1422]">
            <SidebarGroup>
              <div className="flex items-center gap-2 px-3 py-5">
                <div className="h-9 w-9 shrink-0 rounded-full bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-sm font-black tracking-tight select-none">
                  TK
                </div>
                <span className="font-bold text-white text-sm tracking-wide">
                  TrueKhmer
                </span>
              </div>
            </SidebarGroup>
            <SidebarMenu className="space-y-1 px-2">
              {nav.map((item) => {
                if (!item.hide)
                  return (
                    <SidebarMenuItem key={item.href}>
                      <NavLink
                        to={item.href}
                        end={item.href === "/tk-admin"}
                        className="w-full"
                      >
                        {({ isActive }) => (
                          <SidebarMenuButton
                            className={`w-full text-gray-400 hover:bg-[#1a1f2e] hover:text-white ${
                              isActive
                                ? "bg-[#1a1f2e] text-white border-l-2 border-blue-500"
                                : ""
                            }`}
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </SidebarMenuButton>
                        )}
                      </NavLink>
                    </SidebarMenuItem>
                  );
                return null;
              })}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="bg-[#0f1422] border-t border-[#1a1f2e]" />
        </Sidebar>
        <SidebarInset className="bg-[#0a0e1a]">
          <header className="sticky top-0 z-50 w-full border-b border-[#1a1f2e] bg-[#0f1422] flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-gray-400 hover:text-white" />
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Viewing as
                </span>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-[11px] font-semibold uppercase tracking-wider border border-blue-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {user.userRole}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-[#1a1f2e]"
              >
                <Moon className="h-5 w-5" />
              </Button>

              <div className="h-5 w-px bg-[#2a2f3e]" />

              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-[#1a1f2e] relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 hover:bg-[#1a1f2e]"
                  >
                    <span className="text-sm text-gray-300">Viewing as</span>
                    <div className="flex items-center gap-2 px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-semibold">
                      {user.userRole}
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-[#1a1f2e] border-[#2a2f3e]"
                >
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-[#0f1422]">
                    Switch Role
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-[#0f1422]">
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border-2 border-[#1a1f2e]">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                    {user.name}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>
          <div className="overflow-y-auto h-[calc(100vh-4rem)]">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
