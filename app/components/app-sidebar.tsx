import {
  BookmarkCheck,
  CalendarDays,
  ClipboardList,
  FileUser,
  GraduationCap,
  MessagesSquare,
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
import { useUserDisplay } from "~/hooks/use-user-display";
import type { loader as appLayoutLoader } from "~/layout/app-layout";

export type SidebarNavItem = {
  id: string;
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
};

export interface AppSidebarProps {
  /** Role badge shown under the user's name (e.g. "Member", "Creator"). */
  roleLabel: string;
  /** Primary navigation links. */
  items: SidebarNavItem[];
  /** Footer CTA that switches the user to the other space. */
  footer: {
    to: string;
    label: string;
    /** Tailwind classes for the footer button's background/hover colors. */
    className: string;
  };
}

export default function AppSidebar({
  roleLabel,
  items,
  footer,
}: AppSidebarProps) {
  const location = useLocation();
  const { setOpenMobile, isMobile } = useSidebar();
  const routeData =
    useRouteLoaderData<typeof appLayoutLoader>("layout/app-layout");
  const user = routeData?.user;
  const { displayName, initials, profileImage } = useUserDisplay(user);

  const closeMobile = () => isMobile && setOpenMobile(false);

  const activeId = items.reduce<string | null>((match, item) => {
    const matches =
      location.pathname === item.to ||
      location.pathname.startsWith(`${item.to}/`);
    if (!matches) return match;

    const bestTo = items.find((candidate) => candidate.id === match)?.to ?? "";
    return item.to.length > bestTo.length ? item.id : match;
  }, null);

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
                {roleLabel}
              </span>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {items.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  asChild
                  isActive={item.id === activeId}
                  className="rounded-xl p-5 text-[12px] font-normal transition-all data-[active=true]:bg-blue-50 data-[active=true]:text-blue-600"
                >
                  <Link to={item.to} onClick={closeMobile}>
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
        <Button
          asChild
          className={`mb-5 h-12 w-full rounded-xl text-sm font-bold text-white ${footer.className}`}
        >
          <Link to={footer.to} onClick={closeMobile}>
            {footer.label}
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export const mySpaceSidebarConfig: AppSidebarProps = {
  roleLabel: "Member",
  items: [
    { id: "myprofile", label: "My Profile", to: "/myspace", icon: UserRound },
    {
      id: "myapplications",
      label: "My Applications",
      to: "/my-applications",
      icon: FileUser,
    },
    // { id: "myticket", label: "My ticket", to: "/my-ticket", icon: Ticket },
    {
      id: "saveditems",
      label: "Saved Items",
      to: "/saved-items",
      icon: BookmarkCheck,
    },
  ],
  footer: {
    to: "/workspace/manage-post",
    label: "Switch to Workspace",
    className: "bg-[#32A8FF] [a]:hover:bg-[#1E90FF]",
  },
};

export const workSpaceSidebarConfig: AppSidebarProps = {
  roleLabel: "Creator",
  items: [
    {
      id: "managepost",
      label: "Manage Posting",
      to: "/workspace/manage-post",
      icon: ClipboardList,
    },
    {
      id: "discussion",
      label: "My Discussions",
      to: "/workspace",
      icon: MessagesSquare,
    },
    {
      id: "courselisting",
      label: "Course Listing",
      to: "/course-listing",
      icon: GraduationCap,
    },
    {
      id: "myevents",
      label: "My Events",
      to: "/my-events",
      icon: CalendarDays,
    },
  ],
  footer: {
    to: "/myspace",
    label: "Switch to My space",
    className: "bg-[#0b57d0] [a]:hover:bg-[#0b57d0]/90",
  },
};
