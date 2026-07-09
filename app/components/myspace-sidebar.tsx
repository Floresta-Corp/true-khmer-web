import {
  BookmarkCheck,
  ChevronsUpDown,
  FileUser,
  Ticket,
  UserRound,
} from "lucide-react";
import { Link, useLocation, useRouteLoaderData } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import { resolveImageURL } from "~/lib/utils";
import type { loader as appLayoutLoader } from "~/layout/app-layout";

type SidebarItem = {
  id: string;
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
};

const primaryItems: SidebarItem[] = [
  {
    id: "myprofile",
    label: "My profile",
    to: "/myspace",
    icon: UserRound,
  },
  {
    id: "myapplications",
    label: "My applications",
    to: "/my-applications",
    icon: FileUser,
  },
  // {
  //   id: "myticket",
  //   label: "My ticket",
  //   to: "/my-ticket",
  //   icon: Ticket,
  // },
  {
    id: "saveditems",
    label: "Saved items",
    to: "/saved-items",
    icon: BookmarkCheck,
  },
];

export default function MySpaceSideBar() {
  const location = useLocation();
  const { setOpenMobile, isMobile } = useSidebar();
  const routeData =
    useRouteLoaderData<typeof appLayoutLoader>("layout/app-layout");
  const user = routeData?.user;

  const displayName = user?.name || "User";
  const initials = displayName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const profileImage =
    resolveImageURL(user?.profile?.avatarKey) || resolveImageURL(user?.image);

  return (
    <Sidebar
      collapsible={isMobile ? "offcanvas" : "none"}
      className="h-full border-r bg-white"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between gap-2 rounded-2xl border border-[#e2e8f0] p-3">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar className="size-9 border border-[#f9fafb]">
              <AvatarImage
                src={profileImage || undefined}
                alt={displayName}
                className="object-cover"
              />
              <AvatarFallback className="bg-[#EFF6FF] text-xs font-semibold text-[#2F6FE4]">
                {initials}
              </AvatarFallback>
              <AvatarBadge className="bg-emerald-500 ring-2 ring-white" />
            </Avatar>
            <div className="flex min-w-0 flex-col gap-1">
              <span className="truncate text-sm font-semibold text-[#344256]">
                {displayName}
              </span>
              <span className="w-fit truncate rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600">
                Member
              </span>
            </div>
          </div>
          {/* <ChevronsUpDown className="size-4 shrink-0 text-[#94a3b8]" /> */}
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {primaryItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname.startsWith(item.to)}
                  className="rounded-xl p-5 text-[12px] font-normal transition-all data-[active=true]:bg-blue-50 data-[active=true]:text-blue-600"
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
      </SidebarContent>
      <SidebarFooter className="p-2">
        <Button className="h-12 w-full rounded-xl bg-[#32A8FF] text-sm font-bold text-white hover:bg-[#1E90FF]">
          <Link
            to="/manage-post"
            onClick={() => isMobile && setOpenMobile(false)}
          >
            Switch to workspace
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
