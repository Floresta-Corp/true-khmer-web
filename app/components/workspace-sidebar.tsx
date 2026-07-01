import {
  Calendar,
  ClipboardList,
  MessagesSquare,
  Plus,
  Sparkles,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";

type SidebarItem = {
  id: string;
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
};

const primaryItems: SidebarItem[] = [
  {
    id: "managepost",
    label: "Manage Posting",
    to: "/manage-post",
    icon: ClipboardList,
  },
  {
    id: "discussion",
    label: "My Discussions",
    to: "/workspace",
    icon: MessagesSquare,
  },
  {
    id: "myevents",
    label: "My Events",
    to: "/my-events",
    icon: Calendar,
  },
];

export default function WorkSpaceSideBar() {
  const location = useLocation();
  const { setOpenMobile, isMobile } = useSidebar();

  return (
    <Sidebar
      collapsible={isMobile ? "offcanvas" : "none"}
      className="border-r bg-white h-screen"
    >
      <SidebarContent className="p-2">
        <SidebarGroup>
          {/* <div className="p-4 mb-2">
            <span className="font-semibold text-xl text-[#2f6fe4]">
              MySpace
            </span>
          </div> */}

          <SidebarMenu className="gap-2">
            {primaryItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname.startsWith(item.to)}
                  className="p-5 rounded-xl data-[active=true]:bg-blue-50 data-[active=true]:text-blue-600 transition-all text-[12px] font-normal"
                >
                  <Link
                    to={item.to}
                    onClick={() => isMobile && setOpenMobile(false)}
                  >
                    <item.icon className="size-5 shrink-0" />
                    <span className="text-base">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        {/* <SidebarGroup className="p-2">
          <Button
            variant={"outline"}
            disabled
            className="w-full h-14 mb-4 flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-2xl text-gray-300 dark:text-slate-600 cursor-not-allowed transition-all opacity-60"
          >
            <Plus size={18} />
            <span className="text-sm font-bold">Enable new role</span>
          </Button>
        </SidebarGroup> */}
      </SidebarContent>
    </Sidebar>
  );
}
