import {
  Calendar,
  ClipboardList,
  MessagesSquare,
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
    id: "discussion",
    label: "My Discussions",
    to: "/workspace",
    icon: MessagesSquare,
  },
  {
    id: "managepost",
    label: "Manage Posting",
    to: "/manage-post",
    icon: ClipboardList,
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
      className="border-r bg-white"
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
                  isActive={location.pathname === item.to}
                  className="p-5 data-[active=true]:ring data-[active=true]:ring-blue-500 data-[active=true]:bg-blue-50 data-[active=true]:text-blue-600 transition-all text-[12px] font-normal"
                >
                  <Link
                    to={item.to}
                    onClick={() => isMobile && setOpenMobile(false)}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span className="text-base">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button variant="outline" className="w-full gap-2">
          <Sparkles className="h-4 w-4" />
          New Roles
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
