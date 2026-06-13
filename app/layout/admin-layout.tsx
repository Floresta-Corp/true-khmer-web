import { Outlet } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Building2, LayoutDashboard, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router";
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
import { requireSuperAdmin } from "~/lib/server/route-guards.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { admin, setCookie } = await requireSuperAdmin(request);
  const data = { userRole: "Super Admin", adminName: admin.name };

  if (setCookie) {
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": setCookie,
      },
    });
  }

  return data;
}

const nav = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/tk-admin/dashboard",
    exact: true,
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
    label: "User Management",
    href: "/tk-admin/users",
    hide: false,
  },
  { icon: Building2, label: "Partner", href: "/tk-admin/partner", hide: false },
];

export default function AdminLayout({
  loaderData,
}: {
  loaderData?: { userRole?: string };
}) {
  const userRole = loaderData?.userRole ?? "Admin";

  return (
    <div className="flex w-full overflow-hidden">
      <SidebarProvider>
        <Sidebar collapsible="icon" variant="sidebar">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>Test</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarContent>
            {nav.map((item, index) => {
              if (!item.hide)
                return (
                  <SidebarMenuItem key={index}>
                    <Link to={item.href}>
                      <SidebarMenuButton>
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              return null;
            })}
            <SidebarGroup />
          </SidebarContent>
          <SidebarFooter />
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-50 w-full border-b border-[#f1f5f9] bg-white shadow-sm flex items-center h-17 gap-4 px-4 sm:px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em] hidden sm:inline">
                Viewing as
              </span>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-xl text-[11px] font-black uppercase tracking-widest border border-blue-100/50 dark:border-blue-900/20">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                {userRole}
              </div>
            </div>
          </header>
          <div className="overflow-y-auto">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
